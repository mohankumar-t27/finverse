export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  budget: number;
}

export interface MonthlyData {
  budgets: Budget[];
  expenses: Expense[];
}

export interface AppData {
  [key: string]: MonthlyData;
}
