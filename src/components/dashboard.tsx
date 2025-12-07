'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Budget, Expense, MonthlyData } from '@/lib/types';
import Header from '@/components/header';
import OverviewCards from '@/components/overview-cards';
import CategorySpending from '@/components/category-spending';
import SpendingCharts from '@/components/spending-charts';
import RecentTransactions from '@/components/recent-transactions';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths } from 'date-fns';

const STATIC_USER_ID = 'main-user'; // Using a static ID since there's no auth

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const currentMonthKey = format(selectedDate, 'yyyy-MM');

  // Firestore listeners
  const budgetsRef = useMemo(() => {
      if (!firestore) return null;
      return collection(firestore, 'users', STATIC_USER_ID, 'months', currentMonthKey, 'budgets');
  }, [firestore, currentMonthKey]);

  const expensesQuery = useMemo(() => {
      if (!firestore) return null;
      const expensesRef = collection(firestore, 'users', STATIC_USER_ID, 'months', currentMonthKey, 'expenses');
      return query(expensesRef, orderBy('date', 'desc'));
  }, [firestore, currentMonthKey]);

  const { data: budgets, loading: budgetsLoading, error: budgetsError } = useCollection<Budget>(budgetsRef);
  const { data: expenses, loading: expensesLoading, error: expensesError } = useCollection<Expense>(expensesQuery);
  
  const monthlyData: MonthlyData = useMemo(() => ({
    budgets: budgets || [],
    expenses: expenses || [],
  }), [budgets, expenses]);

  const totalBudget = useMemo(() => (budgets || []).reduce((sum, b) => sum + b.budget, 0), [budgets]);
  const totalSpent = useMemo(() => (expenses || []).reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'date'>) => {
    if (!firestore) return;
    
    const expensesRef = collection(firestore, 'users', STATIC_USER_ID, 'months', currentMonthKey, 'expenses');
    
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

  const handleUpdateBudgets = (updatedBudgets: Budget[]) => {
    if (!firestore) return;
    
    updatedBudgets.forEach(budget => {
        const budgetRef = doc(firestore, 'users', STATIC_USER_ID, 'months', currentMonthKey, 'budgets', budget.category);
        setDocumentNonBlocking(budgetRef, budget, { merge: true });
    });

    toast({
      title: 'Budgets Updated',
      description: 'Your monthly budgets have been successfully updated.',
    });
  };

  const handleSelectedDateChange = (date: Date) => {
    setSelectedDate(date);
  }

  const handleRemoveExpense = (expenseId: string) => {
    if (!firestore) return;
    const expenseRef = doc(firestore, 'users', STATIC_USER_ID, 'months', currentMonthKey, 'expenses', expenseId);
    deleteDocumentNonBlocking(expenseRef);
    toast({
      title: 'Expense Removed',
      description: 'The selected expense has been removed.',
    });
  }

  if (budgetsLoading || expensesLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading data...</p>
        </div>
    )
  }

  if (budgetsError || expensesError) {
    return (
         <div className="flex items-center justify-center min-h-screen">
            <p className="text-destructive">Error: {budgetsError?.message || expensesError?.message}</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        budgets={monthlyData.budgets} 
        onAddExpense={handleAddExpense} 
        onUpdateBudgets={handleUpdateBudgets}
        selectedDate={selectedDate}
        onSelectedDateChange={handleSelectedDateChange}
      />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <OverviewCards totalBudget={totalBudget} totalSpent={totalSpent} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CategorySpending budgets={monthlyData.budgets} expenses={monthlyData.expenses} />
          </div>
          <div className="lg:col-span-2">
            <SpendingCharts budgets={monthlyData.budgets} expenses={monthlyData.expenses} />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-1">
            <div className="lg:col-span-1">
                <RecentTransactions expenses={monthlyData.expenses} onRemoveExpense={handleRemoveExpense} />
            </div>
        </div>
      </main>
    </div>
  );
}
