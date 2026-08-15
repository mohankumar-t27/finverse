'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';
import { format, fromUnixTime } from 'date-fns';
import { Button } from './ui/button';
import { Trash2, ReceiptText, Calendar } from 'lucide-react';

interface RecentTransactionsProps {
  expenses: Expense[];
  onRemoveExpense: (id: string) => void;
}

export default function RecentTransactions({ expenses, onRemoveExpense }: RecentTransactionsProps) {
  const recentExpenses = expenses.slice(0, 50);

  const formatDate = (date: any) => {
    if (date && typeof date.seconds === 'number') {
      return format(fromUnixTime(date.seconds), 'MMM dd, yyyy');
    }
    if (typeof date === 'string') {
      return format(new Date(date), 'MMM dd, yyyy');
    }
    return "Invalid date";
  };

  return (
    <Card className="w-full max-w-full h-full flex flex-col border border-border/50 bg-slate-950/40 backdrop-blur-xl shadow-xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-emerald-400 shrink-0" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Logged expenses for the active month
            </CardDescription>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
            {expenses.length} Entries
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 flex-1 flex flex-col min-h-0">
        <ScrollArea className="h-[320px] sm:h-[360px] pr-2 sm:pr-3">
          <div className="space-y-2 py-1">
            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => {
                const Icon = getCategoryIcon(expense.category);
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/70 transition-all duration-200 group gap-2 min-w-0"
                  >
                    {/* Left Details */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-cyan-300 transition-colors">
                          {expense.description || expense.category}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 truncate">
                          <span className="font-medium text-cyan-400/90 truncate">{expense.category}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 shrink-0 font-mono">
                            <Calendar className="h-3 w-3 opacity-60" />
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Amount & Delete */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-rose-400 font-mono">
                        -{formatCurrency(expense.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground/70 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                        onClick={() => onRemoveExpense(expense.id)}
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-[240px] text-center border border-dashed border-border/60 rounded-xl p-6">
                <ReceiptText className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="font-semibold text-sm text-foreground">No expenses recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1">Use the "+ Expense" button in the navigation header to log your first transaction.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
