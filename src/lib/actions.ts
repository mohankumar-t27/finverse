'use server';

import { getBudgetRecommendations } from '@/ai/flows/ai-powered-budget-advisor';
import type { Budget, Expense } from '@/lib/types';

export async function getAIRecommendations(
  budgets: Budget[],
  expenses: Expense[],
  monthlyIncome: number
) {
  try {
    const historicalSpendingData = JSON.stringify(expenses);
    const currentSpendingData = JSON.stringify(
      budgets.map((b) => ({
        category: b.category,
        budget: b.budget,
        spent: expenses
          .filter((e) => e.category === b.category)
          .reduce((acc, e) => acc + e.amount, 0),
      }))
    );

    const result = await getBudgetRecommendations({
      historicalSpendingData,
      currentSpendingData,
      monthlyIncome,
    });
    
    return { success: true, recommendations: result.recommendations };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get AI recommendations.' };
  }
}
