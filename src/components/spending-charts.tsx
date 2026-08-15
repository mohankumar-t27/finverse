'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import type { Budget, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart as PieIcon, LineChart } from 'lucide-react';

const chartConfig = {
  budget: { label: 'Budget Cap', color: '#0ea5e9' },
  spent: { label: 'Actual Spent', color: '#10b981' },
} satisfies ChartConfig;

const PIE_CHART_COLORS = [
  '#0ea5e9', // cyan
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#f43f5e', // rose
];

interface SpendingChartsProps {
  budgets: Budget[];
  expenses: Expense[];
}

export default function SpendingCharts({ budgets, expenses }: SpendingChartsProps) {
  const chartData = useMemo(() => {
    return budgets.map(budget => {
      const spent = expenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return {
        category: budget.category,
        budget: budget.budget,
        spent: spent,
      };
    });
  }, [budgets, expenses]);
  
  const pieChartData = useMemo(() => {
    const spendingByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as {[key: string]: number});
    
    return Object.keys(spendingByCategory).map(category => ({
      name: category,
      value: spendingByCategory[category],
    }));
  }, [expenses]);

  const noData = budgets.length === 0 && expenses.length === 0;

  return (
    <Card className="h-full flex flex-col border border-border/50 bg-slate-950/40 backdrop-blur-xl shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <LineChart className="h-4 w-4 text-sky-400" />
              Spending Analytics
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Visual comparison of monthly budgets vs actual outlay
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
        {noData ? (
          <div className="flex flex-col items-center justify-center h-[260px] text-center border border-dashed border-border/60 rounded-xl p-6">
            <LineChart className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="font-semibold text-sm text-foreground">No spending data to analyze</p>
            <p className="text-xs text-muted-foreground mt-1">Add budget categories and expenses to unlock real-time charts.</p>
          </div>
        ) : (
          <Tabs defaultValue="budget-vs-actual" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-900/60 border border-slate-800 rounded-xl">
              <TabsTrigger value="budget-vs-actual" className="text-xs font-semibold rounded-lg flex items-center justify-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                <BarChart3 className="h-3.5 w-3.5" /> Budget vs Actual
              </TabsTrigger>
              <TabsTrigger value="distribution" className="text-xs font-semibold rounded-lg flex items-center justify-center gap-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
                <PieIcon className="h-3.5 w-3.5" /> Distribution
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Bar Chart */}
            <TabsContent value="budget-vs-actual" className="flex-1 pt-4 min-h-[260px]">
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[260px] w-full">
                  <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.length > 7 ? `${value.slice(0, 6)}…` : value}
                      style={{ fontSize: '11px', fill: 'var(--muted-foreground)' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `₹${value}`} 
                      style={{ fontSize: '11px', fill: 'var(--muted-foreground)' }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
                    />
                    <Bar dataKey="budget" name="Budget Cap" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="spent" name="Spent Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[240px] text-center">
                  <p className="text-sm text-muted-foreground">No budget categories set.</p>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Pie / Distribution Chart */}
            <TabsContent value="distribution" className="flex-1 pt-4 min-h-[260px]">
              {pieChartData.length > 0 ? (
                <ChartContainer config={{}} className="h-[260px] w-full">
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value) => formatCurrency(value as number)} />}
                    />
                    <Pie 
                      data={pieChartData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={90}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {pieChartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} 
                          stroke="rgba(0,0,0,0.3)" 
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[240px] text-center">
                  <p className="text-sm text-muted-foreground">No expenses recorded for pie distribution.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
