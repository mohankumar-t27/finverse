'use client';

import { useMemo } from 'react';
import { collection, doc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Budget, Earned, Expense, MonthlyData } from '@/lib/types';
import OverviewCards from '@/components/overview-cards';
import CategorySpending from '@/components/category-spending';
import SpendingCharts from '@/components/spending-charts';
import RecentTransactions from '@/components/recent-transactions';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Header from './header';

interface MonthlyDashboardProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export default function MonthlyDashboard({ selectedDate, onSelectedDateChange }: MonthlyDashboardProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const currentMonthKey = useMemo(() => {
    const zonedDate = toZonedTime(selectedDate, 'UTC');
    return format(zonedDate, 'yyyy-MM');
  }, [selectedDate]);

  const previousMonthKey = useMemo(() => {
    const prevMonthDate = subMonths(selectedDate, 1);
    const zonedDate = toZonedTime(prevMonthDate, 'UTC');
    return format(zonedDate, 'yyyy-MM');
  }, [selectedDate]);

  // Firestore listeners
  const budgetsRef = useMemo(() => {
      if (!firestore) return null;
      return collection(firestore, 'users', 'main-user', 'months', currentMonthKey, 'budgets');
  }, [firestore, currentMonthKey]);

  const expensesQuery = useMemo(() => {
      if (!firestore) return null;
      const expensesRef = collection(firestore, 'users', 'main-user', 'months', currentMonthKey, 'expenses');
      return query(expensesRef, orderBy('date', 'desc'));
  }, [firestore, currentMonthKey]);
  
  const earnedQuery = useMemo(() => {
      if (!firestore) return null;
      const earnedRef = collection(firestore, 'users', 'main-user', 'months', currentMonthKey, 'earned');
      return query(earnedRef, orderBy('date', 'desc'));
  }, [firestore, currentMonthKey]);
  
  const prevBudgetsRef = useMemo(() => {
      if (!firestore) return null;
      return collection(firestore, 'users', 'main-user', 'months', previousMonthKey, 'budgets');
  }, [firestore, previousMonthKey]);

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
    if (!firestore) return;
    
    const expensesRef = collection(firestore, 'users', 'main-user', 'months', currentMonthKey, 'expenses');
    
    const expenseToAdd = {
      ...newExpense,
      date: serverTimestamp(),
    };

    addDocumentNonBlocking(expensesRef, expenseToAdd);

    toast({
      title: 'Expense Added',
      description: `${newExpense.description} for Rs ${newExpense.amount} in ${newExpense.category}.`,
    });

    const categoryBudget = (budgets || []).find(b => b.category === newExpense.category);
    if (!categoryBudget) return;

    const categorySpent = (expenses || [])
        .filter(e => e.category === newExpense.category)
        .reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;

    if (categoryBudget && categoryBudget.budget > 0 && categorySpent > categoryBudget.budget) {
      toast({
        variant: "destructive",
        title: "Budget Exceeded",
        description: `You've exceeded your budget for ${newExpense.category}!`,
      });
    }
  };

  const handleAddEarned = (newEarned: Omit<Earned, 'id' | 'date'>) => {
    if (!firestore) return;
    
    const earnedRef = collection(firestore, 'users', 'main-user', 'months', currentMonthKey, 'earned');
    
    const earnedToAdd = {
      ...newEarned,
      date: serverTimestamp(),
    };

    addDocumentNonBlocking(earnedRef, earnedToAdd);

    toast({
      title: 'Income Added',
      description: `Added ${newEarned.description} for Rs ${newEarned.amount}.`,
    });
  };

  const handleUpdateBudgets = (updatedBudgets: Budget[]) => {
    if (!firestore) return;
    
    updatedBudgets.forEach(budget => {
        const budgetRef = doc(firestore, 'users', 'main-user', 'months', currentMonthKey, 'budgets', budget.category);
        setDocumentNonBlocking(budgetRef, budget, { merge: true });
    });

    toast({
      title: 'Budgets Updated',
      description: 'Your monthly budgets have been successfully updated.',
    });
  };

  const handleCopyPreviousBudgets = async () => {
    if (!firestore || !prevBudgets || prevBudgets.length === 0) {
      toast({
        variant: "destructive",
        title: "No budgets to copy",
        description: "There are no budgets from the previous month to copy.",
      });
      return;
    }
    handleUpdateBudgets(prevBudgets);
    toast({
      title: "Budgets Copied",
      description: "Previous month's budgets have been copied. You can now adjust and save them.",
    });
  }

  const handleRemoveExpense = (expenseId: string) => {
    if (!firestore) return;
    const expenseRef = doc(firestore, 'users', 'main-user', 'months', currentMonthKey, 'expenses', expenseId);
    deleteDocumentNonBlocking(expenseRef);
    toast({
      title: 'Expense Removed',
      description: 'The selected expense has been removed.',
    });
  }
  
  if (budgetsError || expensesError || earnedError) {
    return (
         <div className="flex items-center justify-center min-h-screen">
            <p className="text-destructive">Error: {budgetsError?.message || expensesError?.message || earnedError?.message}</p>
        </div>
    )
  }

  return (
      <div className="flex flex-col min-h-screen">
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

          <main className="flex-1 p-4 md:p-8 space-y-8">
            {isDataLoading ? (
                <div className="flex flex-1 items-center justify-center p-4 md:p-8">
                    <p>Loading data for {format(selectedDate, 'MMMM yyyy')}...</p>
                </div>
            ) : (
                <>
                    <OverviewCards totalBudget={totalBudget} totalSpent={totalSpent} totalEarned={totalEarned} />
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 mt-8 h-full">
                    <div className="lg:col-span-3">
                        <CategorySpending budgets={monthlyData.budgets} expenses={monthlyData.expenses} />
                    </div>
                    <div className="lg:col-span-2">
                        <SpendingCharts budgets={monthlyData.budgets} expenses={monthlyData.expenses} />
                    </div>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-1 mt-8">
                        <div className="lg:col-span-1">
                            <RecentTransactions expenses={monthlyData.expenses} onRemoveExpense={handleRemoveExpense} />
                        </div>
                    </div>
                </>
            )}
        </main>
      </div>
  );
}
