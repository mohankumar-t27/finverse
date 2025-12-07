'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';
import { format, fromUnixTime } from 'date-fns';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface RecentTransactionsProps {
  expenses: Expense[];
  onRemoveExpense: (id: string) => void;
}

export default function RecentTransactions({ expenses, onRemoveExpense }: RecentTransactionsProps) {
  const recentExpenses = expenses.slice(0, 50);

  const formatDate = (date: any) => {
    if (date && typeof date.seconds === 'number') {
      return format(fromUnixTime(date.seconds), 'MMM dd');
    }
    if (typeof date === 'string') {
      return format(new Date(date), 'MMM dd');
    }
    return "Invalid date";
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Your recent expenses for the selected month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExpenses.length > 0 ? recentExpenses.map(expense => {
                const Icon = getCategoryIcon(expense.category);
                return (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.category} &middot; {formatDate(expense.date)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => onRemoveExpense(expense.id)}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                )
              }) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">No expenses added for this month.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
