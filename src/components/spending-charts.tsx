'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import type { Budget, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const chartConfig = {
  budget: { label: 'Budget', color: 'hsl(var(--chart-1))' },
  spent: { label: 'Spent', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const PIE_CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Spending Analysis</CardTitle>
        <CardDescription>A visual breakdown of your finances.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="budget-vs-actual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="budget-vs-actual">Budget vs. Actual</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="budget-vs-actual">
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-4">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)}/>}
                />
                <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
                <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="distribution">
            <ChartContainer config={{}} className="min-h-[200px] w-full aspect-square mt-4">
              <PieChart>
                 <ChartTooltip
                  content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value) => formatCurrency(value as number)}/>}
                />
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                   {pieChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
