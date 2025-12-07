'use client';

import { useState } from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAIRecommendations } from '@/lib/actions';
import type { Budget, Expense } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AiBudgetAdvisorProps {
  budgets: Budget[];
  expenses: Expense[];
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => void;
}

export default function AiBudgetAdvisor({ budgets, expenses, monthlyIncome, setMonthlyIncome }: AiBudgetAdvisorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations('');
    
    const result = await getAIRecommendations(budgets, expenses, monthlyIncome);

    if (result.success) {
      setRecommendations(result.recommendations || "No recommendations available at this time.");
    } else {
      toast({
        variant: "destructive",
        title: "AI Advisor Error",
        description: result.error,
      });
    }
    
    setIsLoading(false);
  };
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle>AI Budget Advisor</CardTitle>
        </div>
        <CardDescription>Get AI-powered tips to optimize your budget.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <Label htmlFor="monthly-income">Your Monthly Income</Label>
          <Input 
            id="monthly-income"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            placeholder="e.g., 4000"
          />
        </div>
        {recommendations && (
          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>Recommendations</AlertTitle>
            <AlertDescription>
              <div className="prose prose-sm dark:prose-invert">
                {recommendations.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetRecommendations} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get Advice'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
