'use client';

import { useMemo } from 'react';
import { collection, doc, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Budget, Earned, Expense, MonthlyData } from '@/lib/types';
import OverviewCards from '@/components/overview-cards';
import CategorySpending from '@/components/category-spending';
import SpendingCharts from '@/components/spending-charts';
import RecentTransactions from '@/components/recent-transactions';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Header from './header';
import { Sparkles, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';

interface MonthlyDashboardProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export default function MonthlyDashboard({ 
  selectedDate, 
  onSelectedDateChange,
}: MonthlyDashboardProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useAuth();
  const userId = user?.uid;

  const currentMonthKey = useMemo(() => {
    const zonedDate = toZonedTime(selectedDate, 'UTC');
    return format(zonedDate, 'yyyy-MM');
  }, [selectedDate]);

  const previousMonthKey = useMemo(() => {
    const prevMonthDate = subMonths(selectedDate, 1);
    const zonedDate = toZonedTime(prevMonthDate, 'UTC');
    return format(zonedDate, 'yyyy-MM');
  }, [selectedDate]);

  const budgetsRef = (firestore && userId) ? collection(firestore, 'users', userId, 'months', currentMonthKey, 'budgets') : null;
  const expensesQuery = (firestore && userId) ? query(collection(firestore, 'users', userId, 'months', currentMonthKey, 'expenses'), orderBy('date', 'desc')) : null;
  const earnedQuery = (firestore && userId) ? query(collection(firestore, 'users', userId, 'months', currentMonthKey, 'earned'), orderBy('date', 'desc')) : null;
  const prevBudgetsRef = (firestore && userId) ? collection(firestore, 'users', userId, 'months', previousMonthKey, 'budgets') : null;

  const { data: budgets, loading: budgetsLoading, error: budgetsError } = useCollection<Budget>(budgetsRef);
  const { data: expenses, loading: expensesLoading, error: expensesError } = useCollection<Expense>(expensesQuery);
  const { data: earned, loading: earnedLoading, error: earnedError } = useCollection<Earned>(earnedQuery);
  const { data: prevBudgets, loading: prevBudgetsLoading } = useCollection<Budget>(prevBudgetsRef);

  const canCopyPreviousBudgets = useMemo(() => (prevBudgets || []).length > 0 && (budgets || []).length === 0, [prevBudgets, budgets]);
  const isDataLoading = budgetsLoading || expensesLoading || earnedLoading || prevBudgetsLoading;

  const monthlyData: MonthlyData = useMemo(() => ({
    budgets: budgets || [],
    expenses: expenses || [],
    earned: earned || [],
  }), [budgets, expenses, earned]);

  const totalBudget = useMemo(() => (budgets || []).reduce((sum, b) => sum + b.budget, 0), [budgets]);
  const totalSpent = useMemo(() => (expenses || []).reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalEarned = useMemo(() => (earned || []).reduce((sum, e) => sum + e.amount, 0), [earned]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'date'>) => {
    if (!firestore || !userId) return;
    const expensesRef = collection(firestore, 'users', userId, 'months', currentMonthKey, 'expenses');
    
    addDocumentNonBlocking(expensesRef, {
      ...newExpense,
      date: serverTimestamp(),
    });

    toast({
      title: 'Expense Recorded',
      description: `${newExpense.description} for ₹${newExpense.amount} under ${newExpense.category}.`,
    });

    const categoryBudget = (budgets || []).find(b => b.category === newExpense.category);
    if (!categoryBudget) return;

    const categorySpent = (expenses || [])
        .filter(e => e.category === newExpense.category)
        .reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;

    if (categoryBudget && categoryBudget.budget > 0 && categorySpent > categoryBudget.budget) {
      toast({
        variant: "destructive",
        title: "Budget Cap Exceeded!",
        description: `Over-budget alert for ${newExpense.category}!`,
      });
    }
  };

  const handleAddEarned = (newEarned: Omit<Earned, 'id' | 'date'>) => {
    if (!firestore || !userId) return;
    const earnedRef = collection(firestore, 'users', userId, 'months', currentMonthKey, 'earned');
    
    addDocumentNonBlocking(earnedRef, {
      ...newEarned,
      date: serverTimestamp(),
    });

    toast({
      title: 'Income Added',
      description: `Logged ${newEarned.description} for ₹${newEarned.amount}.`,
    });
  };

  const handleUpdateBudgets = (updatedBudgets: Budget[], originalCategories: string[]) => {
    if (!firestore || !userId) return;
    const batch = writeBatch(firestore);

    updatedBudgets.forEach(budget => {
      const budgetRef = doc(firestore, 'users', userId, 'months', currentMonthKey, 'budgets', budget.category);
      batch.set(budgetRef, budget, { merge: true });
    });

    const updatedCategories = updatedBudgets.map(b => b.category);
    const categoriesToDelete = originalCategories.filter(c => !updatedCategories.includes(c));
    
    categoriesToDelete.forEach(category => {
      const budgetRef = doc(firestore, 'users', userId, 'months', currentMonthKey, 'budgets', category);
      batch.delete(budgetRef);
    });

    batch.commit().then(() => {
      toast({
        title: 'Budgets Updated',
        description: 'Monthly category budgets saved successfully.',
      });
    }).catch(error => {
      console.error("Error updating budgets: ", error);
      toast({
        variant: "destructive",
        title: 'Update Failed',
        description: 'Could not update budget settings.',
      });
    });
  };

  const handleCopyPreviousBudgets = async () => {
    if (!firestore || !prevBudgets || prevBudgets.length === 0) {
      toast({
        variant: "destructive",
        title: "No Previous Budgets",
        description: "No budget data found from the previous month.",
      });
      return;
    }
    handleUpdateBudgets(prevBudgets, []);
    toast({
      title: "Budgets Cloned",
      description: "Successfully copied previous month's budget structure.",
    });
  };

  const handleRemoveExpense = (expenseId: string) => {
    if (!firestore || !userId) return;
    const expenseRef = doc(firestore, 'users', userId, 'months', currentMonthKey, 'expenses', expenseId);
    deleteDocumentNonBlocking(expenseRef);
    toast({
      title: 'Transaction Deleted',
      description: 'The selected expense was removed.',
    });
  };

  if (budgetsError || expensesError || earnedError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-rose-400 font-semibold">Error: {budgetsError?.message || expensesError?.message || earnedError?.message}</p>
      </div>
    );
  }

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'User';

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-[140px]" />
      </div>

      <Header
        selectedDate={selectedDate}
        onSelectedDateChange={onSelectedDateChange}
        budgets={monthlyData.budgets}
        onUpdateBudgets={handleUpdateBudgets}
        onAddEarned={handleAddEarned}
        onAddExpense={handleAddExpense}
        onCopyPreviousBudgets={handleCopyPreviousBudgets}
        canCopyPreviousBudgets={canCopyPreviousBudgets}
      />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                Financial Control Center
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Encrypted Sync
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">{userName}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Overview for <span className="font-semibold text-foreground">{format(selectedDate, 'MMMM yyyy')}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-cyan-400" />
              <span>{format(selectedDate, 'MMMM yyyy')}</span>
            </div>
          </div>
        </div>

        {isDataLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-3 h-80 rounded-2xl bg-slate-900/60 border border-slate-800" />
              <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-900/60 border border-slate-800" />
            </div>
          </div>
        ) : (
          <>
            <OverviewCards totalBudget={totalBudget} totalSpent={totalSpent} totalEarned={totalEarned} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-3 min-h-[380px]">
                <CategorySpending budgets={monthlyData.budgets} expenses={monthlyData.expenses} />
              </div>
              <div className="lg:col-span-2 min-h-[380px]">
                <SpendingCharts budgets={monthlyData.budgets} expenses={monthlyData.expenses} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
              <div>
                <RecentTransactions expenses={monthlyData.expenses} onRemoveExpense={handleRemoveExpense} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
