'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Budget, Expense, AppData, MonthlyData } from '@/lib/types';
import Header from '@/components/header';
import OverviewCards from '@/components/overview-cards';
import CategorySpending from '@/components/category-spending';
import SpendingCharts from '@/components/spending-charts';
import RecentTransactions from '@/components/recent-transactions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const initialBudgets: Budget[] = [
  { category: 'Food & Dining', budget: 0 },
  { category: 'Transportation', budget: 0 },
  { category: 'Housing & Utilities', budget: 0 },
  { category: 'Entertainment', budget: 0 },
  { category: 'Shopping', budget: 0 },
  { category: 'Health & Wellness', budget: 0 },
];

const initialExpenses: Expense[] = [];

const getInitialData = (): AppData => {
  if (typeof window === 'undefined') return {};
  const storedData = localStorage.getItem('expenseTrackerData');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Basic validation to ensure it's not malformed
      if (typeof parsedData === 'object' && parsedData !== null) {
        return parsedData;
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage", e);
      // If parsing fails, return a clean slate
    }
  }
  const currentMonthKey = format(new Date(), 'yyyy-MM');
  return {
    [currentMonthKey]: {
      budgets: initialBudgets,
      expenses: initialExpenses,
    },
  };
};

export default function Dashboard() {
  const [data, setData] = useState<AppData>(getInitialData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();
  
  const currentMonthKey = format(selectedDate, 'yyyy-MM');

  useEffect(() => {
    localStorage.setItem('expenseTrackerData', JSON.stringify(data));
  }, [data]);
  
  const monthlyData: MonthlyData = useMemo(() => {
    return data[currentMonthKey] || { budgets: initialBudgets.map(b => ({...b, budget: 0})), expenses: [] };
  }, [data, currentMonthKey]);

  const { budgets, expenses } = monthlyData;

  const totalBudget = useMemo(() => budgets.reduce((sum, b) => sum + b.budget, 0), [budgets]);
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'date'>) => {
    const expenseToAdd: Expense = {
      ...newExpense,
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
    };
    
    setData(prevData => {
        const newData = {...prevData};
        const newMonthlyData = {
            budgets: prevData[currentMonthKey]?.budgets || initialBudgets.map(b => ({...b, budget: 0})),
            expenses: [expenseToAdd, ...(prevData[currentMonthKey]?.expenses || [])]
        };
        newData[currentMonthKey] = newMonthlyData;
        return newData;
    });

    toast({
      title: 'Expense Added',
      description: `${newExpense.description} for Rs ${newExpense.amount} in ${newExpense.category}.`,
    });

    const categoryBudget = budgets.find(b => b.category === newExpense.category);
    if (!categoryBudget) return;

    const categorySpent = (prevData[currentMonthKey]?.expenses || [])
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
    setData(prevData => {
        const newData = {...prevData};
        const newMonthlyData = {
            budgets: updatedBudgets,
            expenses: prevData[currentMonthKey]?.expenses || []
        };
        newData[currentMonthKey] = newMonthlyData;
        return newData;
    });

    toast({
      title: 'Budgets Updated',
      description: 'Your monthly budgets have been successfully updated.',
    });
  };

  const handleSelectedDateChange = (date: Date) => {
    setSelectedDate(date);
    const newMonthKey = format(date, 'yyyy-MM');
    if (!data[newMonthKey]) {
        // If no data for new month, create it with default categories but zero budget
        const previousMonthKey = format(subMonths(date, 1), 'yyyy-MM');
        const previousBudgets = data[previousMonthKey]?.budgets || initialBudgets;
        
        setData(prevData => ({
            ...prevData,
            [newMonthKey]: {
                budgets: previousBudgets.map(b => ({...b})), // Carry over categories & budgets
                expenses: [],
            }
        }));
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        budgets={budgets} 
        onAddExpense={handleAddExpense} 
        onUpdateBudgets={handleUpdateBudgets}
        selectedDate={selectedDate}
        onSelectedDateChange={handleSelectedDateChange}
      />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <OverviewCards totalBudget={totalBudget} totalSpent={totalSpent} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <CategorySpending budgets={budgets} expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <SpendingCharts budgets={budgets} expenses={expenses} />
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-1">
            <div className="lg:col-span-1">
                <RecentTransactions expenses={expenses} />
            </div>
        </div>
      </main>
    </div>
  );
}
