'use server';

/**
 * @fileOverview Provides AI-powered recommendations for optimizing budget allocations based on spending patterns.
 *
 * - getBudgetRecommendations - A function that takes spending data and returns budget optimization recommendations.
 * - BudgetRecommendationsInput - The input type for the getBudgetRecommendations function.
 * - BudgetRecommendationsOutput - The return type for the getBudgetRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetRecommendationsInputSchema = z.object({
  historicalSpendingData: z.string().describe('Historical spending data as a JSON string, including category and amount spent.'),
  currentSpendingData: z.string().describe('Current spending data as a JSON string, including category and amount spent.'),
  monthlyIncome: z.number().describe('The user monthly income'),
});

export type BudgetRecommendationsInput = z.infer<typeof BudgetRecommendationsInputSchema>;

const BudgetRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('AI-powered recommendations for optimizing budget allocations as a string.'),
});

export type BudgetRecommendationsOutput = z.infer<typeof BudgetRecommendationsOutputSchema>;

export async function getBudgetRecommendations(input: BudgetRecommendationsInput): Promise<BudgetRecommendationsOutput> {
  return budgetRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetRecommendationsPrompt',
  input: {schema: BudgetRecommendationsInputSchema},
  output: {schema: BudgetRecommendationsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the historical and current spending data provided by the user, and suggest ways to optimize their budget.

  Consider the user's monthly income, and identify areas where they can potentially cut back or reallocate funds to better align with their financial goals.

  Historical Spending Data: {{{historicalSpendingData}}}
  Current Spending Data: {{{currentSpendingData}}}
  Monthly Income: {{{monthlyIncome}}}

  Provide clear and actionable recommendations.
  Ensure the output is a coherent and well-formatted string.
  `,
});

const budgetRecommendationsFlow = ai.defineFlow(
  {
    name: 'budgetRecommendationsFlow',
    inputSchema: BudgetRecommendationsInputSchema,
    outputSchema: BudgetRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
