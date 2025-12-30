'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import type { Budget, Expense } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';

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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Category Spending</CardTitle>
        <CardDescription>Your spending progress for each category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
                {categorySpending.length > 0 ? categorySpending.map(item => {
                const Icon = getCategoryIcon(item.category);
                return (
                    <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                        </span>
                    </div>
                    <Progress value={item.percentage} />
                    </div>
                )
                }) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <p className="text-muted-foreground">No budget categories set.</p>
                    <p className="text-sm text-muted-foreground">Click 'Set Budgets' to get started.</p>
                </div>
                )}
            </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
