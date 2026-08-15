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
    <Card className="h-full flex flex-col border border-border/50 bg-slate-950/40 backdrop-blur-xl shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-emerald-400" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Logged expenses for the active month
            </CardDescription>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {expenses.length} Entries
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
        <ScrollArea className="h-[320px] pr-3">
          <div className="space-y-2 py-1">
            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => {
                const Icon = getCategoryIcon(expense.category);
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/70 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate group-hover:text-cyan-300 transition-colors">
                          {expense.description || expense.category}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="font-medium text-cyan-400/90">{expense.category}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 opacity-60" />
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-rose-400 font-mono">
                        -{formatCurrency(expense.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => onRemoveExpense(expense.id)}
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-[240px] text-center border border-dashed border-border/60 rounded-xl p-6">
                <ReceiptText className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="font-semibold text-sm text-foreground">No expenses recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1">Use the "+ Add Expense" button above to log your first transaction.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
