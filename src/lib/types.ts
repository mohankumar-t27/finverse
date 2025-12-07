import { FieldValue } from "firebase/firestore";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: FieldValue | string;
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
