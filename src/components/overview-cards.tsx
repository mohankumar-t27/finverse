'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, CircleDollarSign, Wallet, Banknote, Landmark, Eye, EyeOff, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
};

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
  const usedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const toggleVisibility = (card: keyof CardVisibility) => {
    setVisibilities(prev => ({ ...prev, [card]: !prev[card] }));
  };

  const renderValue = (amount: number, isVisible: boolean, className?: string) => {
    return (
      <div className={cn(
        "text-2xl font-extrabold tracking-tight transition-all duration-300 font-mono", 
        !isVisible && "blur-md select-none opacity-40",
        className
      )}>
        {formatCurrency(amount)}
      </div>
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Income Card */}
      <Card className="relative overflow-hidden border border-emerald-500/20 bg-slate-950/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/40 group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Income</CardTitle>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => toggleVisibility('income')} className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-300">
              {visibilities.income ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderValue(totalEarned, visibilities.income, "text-emerald-400")}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400/80 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>Monthly earned inflow</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Budget Card */}
      <Card className="relative overflow-hidden border border-cyan-500/20 bg-slate-950/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/40 group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-cyan-400">Total Budget</CardTitle>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => toggleVisibility('budget')} className="h-7 w-7 rounded-lg hover:bg-cyan-500/10 text-cyan-400/70 hover:text-cyan-300">
              {visibilities.budget ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderValue(totalBudget, visibilities.budget, "text-cyan-300")}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-cyan-400/80 font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span>Allocated spending limit</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Spent Card */}
      <Card className="relative overflow-hidden border border-indigo-500/20 bg-slate-950/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/40 group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-400">Total Spent</CardTitle>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => toggleVisibility('spent')} className="h-7 w-7 rounded-lg hover:bg-indigo-500/10 text-indigo-400/70 hover:text-indigo-300">
              {visibilities.spent ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderValue(totalSpent, visibilities.spent, "text-indigo-300")}
          <div className="flex items-center justify-between mt-1 text-[11px] font-medium text-indigo-400/80">
            <span>{usedPercentage > 100 ? 'Over Limit!' : `${usedPercentage.toFixed(0)}% utilized`}</span>
            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", usedPercentage > 90 ? "bg-rose-500/20 text-rose-400" : "bg-indigo-500/20 text-indigo-300")}>
              {usedPercentage.toFixed(0)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Remaining Card */}
      <Card className="relative overflow-hidden border border-sky-500/20 bg-slate-950/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/40 group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-sky-400">Remaining</CardTitle>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => toggleVisibility('remaining')} className="h-7 w-7 rounded-lg hover:bg-sky-500/10 text-sky-400/70 hover:text-sky-300">
              {visibilities.remaining ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderValue(remainingFromBudget, visibilities.remaining, remainingFromBudget < 0 ? 'text-rose-400' : 'text-sky-300')}
          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-sky-400/80">
            {remainingFromBudget < 0 ? (
              <span className="text-rose-400 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Budget Exceeded</span>
            ) : (
              <span>Available in budget</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 5. Savings Card */}
      <Card className="relative overflow-hidden border border-purple-500/20 bg-slate-950/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/40 group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-400">Net Savings</CardTitle>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => toggleVisibility('savings')} className="h-7 w-7 rounded-lg hover:bg-purple-500/10 text-purple-400/70 hover:text-purple-300">
              {visibilities.savings ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderValue(savings, visibilities.savings, savings < 0 ? 'text-rose-400' : 'text-purple-300')}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-purple-400/80 font-medium">
            <span>Income minus budget</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
