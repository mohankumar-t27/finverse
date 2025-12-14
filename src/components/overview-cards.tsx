'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, CircleDollarSign, Wallet, Banknote, Landmark, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';

interface OverviewCardsProps {
  totalBudget: number;
  totalSpent: number;
  totalEarned: number;
}

type CardVisibility = {
    income: boolean;
    budget: boolean;
    spent: boolean;
    remaining: boolean;
    savings: boolean;
}

export default function OverviewCards({ totalBudget, totalSpent, totalEarned }: OverviewCardsProps) {
  const [visibilities, setVisibilities] = useState<CardVisibility>({
    income: true,
    budget: true,
    spent: true,
    remaining: true,
    savings: true,
  });
  
  const remainingFromBudget = totalBudget - totalSpent;
  const savings = totalEarned - totalBudget;

  const toggleVisibility = (card: keyof CardVisibility) => {
    setVisibilities(prev => ({ ...prev, [card]: !prev[card] }));
  };

  const renderValue = (amount: number, isVisible: boolean) => {
    if (!isVisible) {
      return <span className="text-2xl font-bold">Rs ****</span>;
    }
    return <div className="text-2xl font-bold">{formatCurrency(amount)}</div>;
  };

  const renderValueWithColor = (amount: number, isVisible: boolean, positiveClass: string, negativeClass: string) => {
    if (!isVisible) {
        return <span className="text-2xl font-bold">Rs ****</span>;
    }
    return <div className={`text-2xl font-bold ${amount < 0 ? negativeClass : positiveClass}`}>{formatCurrency(amount)}</div>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => toggleVisibility('income')} className="h-6 w-6">
                {visibilities.income ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </Button>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {renderValue(totalEarned, visibilities.income)}
            <p className="text-xs text-muted-foreground">Your total monthly income</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleVisibility('budget')} className="h-6 w-6">
                    {visibilities.budget ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {renderValue(totalBudget, visibilities.budget)}
            <p className="text-xs text-muted-foreground">Your total monthly budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleVisibility('spent')} className="h-6 w-6">
                    {visibilities.spent ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {renderValue(totalSpent, visibilities.spent)}
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(0)}% of budget used` : 'No budget set'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleVisibility('remaining')} className="h-6 w-6">
                    {visibilities.remaining ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {renderValueWithColor(remainingFromBudget, visibilities.remaining, 'text-primary', 'text-destructive')}
            <p className="text-xs text-muted-foreground">Remaining from your budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => toggleVisibility('savings')} className="h-6 w-6">
                    {visibilities.savings ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Landmark className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {renderValueWithColor(savings, visibilities.savings, 'text-accent', 'text-destructive')}
            <p className="text-xs text-muted-foreground">Planned savings based on budget</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
