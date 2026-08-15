'use client';

import MonthSelector from './month-selector';
import BudgetSetupDialog from './budget-setup-dialog';
import AddEarnedDialog from './add-earned-dialog';
import AddExpenseDialog from './add-expense-dialog';
import type { Budget, Earned, Expense } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';
import { useAuth } from '@/firebase';
import Logo from './logo';
import { ExternalLink, Globe, Sparkles, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

interface HeaderProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
  budgets: Budget[];
  onUpdateBudgets: (updatedBudgets: Budget[], originalCategories: string[]) => void;
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
  canCopyPreviousBudgets
}: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150 transition-all">
      {/* Top subtle glowing accent border line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500" />
      
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        {/* Brand & Versetile Products Dropdown (Left) */}
        <div className="flex w-full items-center justify-between sm:w-auto">
          <div className="flex items-center gap-3">
            <a href="https://fin.versetile.in" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <Logo className="h-9 w-9 shrink-0" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400">
                  FinVerse
                </span>
                <span className="font-semibold text-[10px] tracking-wider text-cyan-400/80 uppercase -mt-1">
                  Quantum Intelligence Platform
                </span>
              </div>
            </a>

            {/* Versetile Ecosystem Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Versetile Ecosystem
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="glass w-56 p-2 space-y-1">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Versetile Products
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="https://versetile.in" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between font-semibold text-xs">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-cyan-400" />
                      Versetile Main Site
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="https://fin.versetile.in" className="flex items-center justify-between font-semibold text-xs text-emerald-400">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      FinVerse Live App
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20">Active</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            {user && <UserNav user={user} />}
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          {/* Month Selector */}
          <MonthSelector selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />

          {/* Quick Action Triggers */}
          <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto">
            <BudgetSetupDialog 
              budgets={budgets} 
              onUpdateBudgets={onUpdateBudgets}
              onCopyPreviousBudgets={onCopyPreviousBudgets}
              canCopyPreviousBudgets={canCopyPreviousBudgets}
            />
            <AddEarnedDialog onAddEarned={onAddEarned} />
            <AddExpenseDialog categories={budgets.map(b => b.category)} onAddExpense={onAddExpense} />
            
            <div className="hidden items-center gap-2 pl-2 border-l border-border/60 sm:flex">
              <ThemeToggle />
              {user && <UserNav user={user} />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
