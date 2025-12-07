'use client';

import { useState, useMemo } from 'react';
import type { Budget, Expense } from '@/lib/types';
import Header from '@/components/header';
import OverviewCards from '@/components/overview-cards';
import CategorySpending from '@/components/category-spending';
import SpendingCharts from '@/components/spending-charts';
import RecentTransactions from '@/components/recent-transactions';
import { useToast } from '@/hooks/use-toast';

const initialBudgets: Budget[] = [
  { category: 'Food & Dining', budget: 400 },
  { category: 'Transportation', budget: 150 },
  { category: 'Housing & Utilities', budget: 1200 },
  { category: 'Entertainment', budget: 100 },
  { category: 'Shopping', budget: 200 },
  { category: 'Health & Wellness', budget: 80 },
];

const initialExpenses: Expense[] = [
  { id: '1', amount: 55.3, category: 'Food & Dining', description: 'Groceries', date: new Date(new Date().setDate(2)).toISOString() },
  { id: '2', amount: 25, category: 'Transportation', description: 'Gas', date: new Date(new Date().setDate(3)).toISOString() },
  { id: '3', amount: 1100, category: 'Housing & Utilities', description: 'Rent', date: new Date(new Date().setDate(1)).toISOString() },
  { id: '4', amount: 45, category: 'Entertainment', description: 'Movie tickets', date: new Date(new Date().setDate(5)).toISOString() },
  { id: '5', amount: 120, category: 'Shopping', description: 'New shoes', date: new Date(new Date().setDate(6)).toISOString() },
  { id: '6', amount: 22.5, category: 'Food & Dining', description: 'Lunch', date: new Date(new Date().setDate(7)).toISOString() },
  { id: '7', amount: 50, category: 'Health & Wellness', description: 'Pharmacy', date: new Date(new Date().setDate(8)).toISOString() },
];


export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const { toast } = useToast();

  const totalBudget = useMemo(() => budgets.reduce((sum, b) => sum + b.budget, 0), [budgets]);
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'date'>) => {
    const expenseToAdd: Expense = {
      ...newExpense,
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
    };
    setExpenses(prev => [expenseToAdd, ...prev]);
    toast({
      title: 'Expense Added',
      description: `${newExpense.description} for ${newExpense.amount} in ${newExpense.category}.`,
    });

    const categoryBudget = budgets.find(b => b.category === newExpense.category);
    const categorySpent = expenses.filter(e => e.category === newExpense.category).reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;

    if (categoryBudget && categorySpent > categoryBudget.budget) {
      toast({
        variant: "destructive",
        title: "Budget Exceeded",
        description: `You've exceeded your budget for ${newExpense.category}!`,
      });
    }
  };

  const handleUpdateBudgets = (updatedBudgets: Budget[]) => {
    setBudgets(updatedBudgets);
    toast({
      title: 'Budgets Updated',
      description: 'Your monthly budgets have been successfully updated.',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header budgets={budgets} expenses={expenses} onAddExpense={handleAddExpense} onUpdateBudgets={handleUpdateBudgets} />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <OverviewCards totalBudget={totalBudget} totalSpent={totalSpent} />
        <div className="grid gap-8 md:grid-cols-2">
            <CategorySpending budgets={budgets} expenses={expenses} />
            <SpendingCharts budgets={budgets} expenses={expenses} />
        </div>
        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-5">
                <RecentTransactions expenses={expenses} />
            </div>
        </div>
      </main>
    </div>
  );
}
