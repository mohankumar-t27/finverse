'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, CircleDollarSign, Wallet, Banknote, Landmark } from 'lucide-react';

interface OverviewCardsProps {
  totalBudget: number;
  totalSpent: number;
  totalEarned: number;
}

export default function OverviewCards({ totalBudget, totalSpent, totalEarned }: OverviewCardsProps) {
  const remainingFromBudget = totalBudget - totalSpent;
  const savings = totalEarned - totalSpent;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalEarned)}</div>
          <p className="text-xs text-muted-foreground">Your total monthly income</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          <p className="text-xs text-muted-foreground">Your total monthly budget</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-muted-foreground">
            {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% of budget used` : 'No budget set'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${remainingFromBudget < 0 ? 'text-destructive' : 'text-primary'}`}>
            {formatCurrency(remainingFromBudget)}
          </div>
          <p className="text-xs text-muted-foreground">Remaining from your budget</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings</CardTitle>
          <Landmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${savings < 0 ? 'text-destructive' : 'text-accent'}`}>
            {formatCurrency(savings)}
          </div>
          <p className="text-xs text-muted-foreground">Remaining from your income</p>
        </CardContent>
      </Card>
    </div>
  );
}
