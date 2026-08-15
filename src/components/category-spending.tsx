'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { Budget, Expense } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

interface CategorySpendingProps {
  budgets: Budget[];
  expenses: Expense[];
}

export default function CategorySpending({ budgets, expenses }: CategorySpendingProps) {
  const categorySpending = useMemo(() => {
    return budgets.map(budget => {
      const spent = expenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      const percentage = budget.budget > 0 ? (spent / budget.budget) * 100 : 0;
      return {
        ...budget,
        spent,
        percentage,
      };
    });
  }, [budgets, expenses]);

  return (
    <Card className="w-full h-full flex flex-col border border-border/50 bg-slate-950/40 backdrop-blur-xl shadow-xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400 shrink-0" />
              Category Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Live tracking against target budget caps
            </CardDescription>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono">
            {categorySpending.length} Categories
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 flex-1 flex flex-col min-h-0">
        <ScrollArea className="h-[320px] sm:h-[360px] pr-2 sm:pr-3">
          <div className="space-y-3 py-1">
            {categorySpending.length > 0 ? (
              categorySpending.map(item => {
                const Icon = getCategoryIcon(item.category);
                const isOver = item.percentage > 100;
                const isWarning = item.percentage > 80 && !isOver;

                const progressColor = isOver
                  ? "bg-rose-500"
                  : isWarning
                  ? "bg-amber-400"
                  : "bg-gradient-to-r from-cyan-500 to-emerald-400";

                const badgeColor = isOver
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  : isWarning
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

                return (
                  <div 
                    key={item.category} 
                    className="p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 group space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-cyan-300 transition-colors truncate">
                            {item.category}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-muted-foreground font-mono truncate">
                            {formatCurrency(item.spent)} <span className="opacity-60">of</span> {formatCurrency(item.budget)}
                          </div>
                        </div>
                      </div>

                      <span className={cn("text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border font-mono shrink-0", badgeColor)}>
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 sm:h-2 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500 ease-out", progressColor)}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-center border border-dashed border-border/60 rounded-xl p-6">
                <p className="font-semibold text-sm text-foreground">No budget categories set</p>
                <p className="text-xs text-muted-foreground mt-1">Click 'Budgets' in the navigation header to initialize categories.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
