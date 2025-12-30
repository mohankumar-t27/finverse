'use client';

import { IndianRupee } from 'lucide-react';
import MonthSelector from './month-selector';
import BudgetSetupDialog from './budget-setup-dialog';
import AddEarnedDialog from './add-earned-dialog';
import AddExpenseDialog from './add-expense-dialog';
import type { Budget, Earned, Expense } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';
import { useAuth } from '@/firebase';

interface HeaderProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  budgets: Budget[];
  onUpdateBudgets: (budgets: Budget[]) => void;
  onAddEarned: (earned: Omit<Earned, 'id' | 'date'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onCopyPreviousBudgets: () => void;
  canCopyPreviousBudgets: boolean;
}

export default function Header({ 
  selectedDate, 
  onSelectedDateChange,
  budgets,
  onUpdateBudgets,
  onAddEarned,
  onAddExpense,
  onCopyPreviousBudgets,
  canCopyPreviousBudgets,
}: HeaderProps) {
  const { user } = useAuth();
  return (
    <header className="glass sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-card/80 p-4 sm:h-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:px-6">
      <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-xl">
            MokiSpends
          </h1>
        </div>
      </div>
      
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:w-auto md:justify-end">
        <MonthSelector selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
        <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
            <BudgetSetupDialog 
              budgets={budgets} 
              onUpdateBudgets={onUpdateBudgets}
              onCopyPreviousBudgets={onCopyPreviousBudgets}
              canCopyPreviousBudgets={canCopyPreviousBudgets}
            />
            <AddEarnedDialog onAddEarned={onAddEarned} />
            <AddExpenseDialog categories={budgets.map(b => b.category)} onAddExpense={onAddExpense} />
            <div className="flex items-center gap-2">
                <ThemeToggle />
                { user && <UserNav user={user} /> }
            </div>
        </div>
      </div>
    </header>
  );
}
