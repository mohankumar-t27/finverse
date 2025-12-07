'use client';

import { IndianRupee } from 'lucide-react';
import AddExpenseDialog from '@/components/add-expense-dialog';
import BudgetSetupDialog from '@/components/budget-setup-dialog';
import type { Budget } from '@/lib/types';
import MonthSelector from './month-selector';
import type { Expense } from '@/lib/types';


interface HeaderProps {
  budgets: Budget[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onUpdateBudgets: (budgets: Budget[]) => void;
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export default function Header({ budgets, onAddExpense, onUpdateBudgets, selectedDate, onSelectedDateChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-primary" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground font-headline whitespace-nowrap">
            Monthly Expense Calculator
            </h1>
        </div>
        <MonthSelector selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
      </div>
      <div className="flex items-center gap-2">
        <BudgetSetupDialog budgets={budgets} onUpdateBudgets={onUpdateBudgets} />
        <AddExpenseDialog categories={budgets.map(b => b.category)} onAddExpense={onAddExpense} />
      </div>
    </header>
  );
}
