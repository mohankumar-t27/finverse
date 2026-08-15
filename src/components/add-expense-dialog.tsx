'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Expense } from '@/lib/types';
import { useMediaQuery } from '@/hooks/use-media-query';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string(),
});

interface AddExpenseDialogProps {
  categories: string[];
  onAddExpense: (expense: Omit<Expense, 'id'|'date'>) => void;
}

export default function AddExpenseDialog({ categories, onAddExpense }: AddExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] glass border-border/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-400" />
              Add New Expense
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log an expense transaction for your monthly budget.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm categories={categories} onAddExpense={onAddExpense} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass border-t border-border/60">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-rose-400" />
            Add New Expense
          </DrawerTitle>
          <DialogDescription className="text-xs">
            Log an expense transaction.
          </DialogDescription>
        </DrawerHeader>
        <ExpenseForm categories={categories} onAddExpense={onAddExpense} setIsOpen={setIsOpen} className="px-4"/>
        <DrawerFooter className="pt-2" />
      </DrawerContent>
    </Drawer>
  );
}

interface ExpenseFormProps {
  categories: string[];
  onAddExpense: (expense: Omit<Expense, 'id'|'date'>) => void;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

function ExpenseForm({ categories, onAddExpense, setIsOpen, className }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: categories[0] || '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof expenseSchema>) {
    onAddExpense(values);
    form.reset();
    setIsOpen(false);
  }

  const setPresetAmount = (val: number) => {
    form.setValue('amount', val, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Amount (₹)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-mono text-muted-foreground">₹</span>
                  <Input type="number" step="any" placeholder="0.00" className="pl-7 font-mono text-base font-bold bg-background" {...field} />
                </div>
              </FormControl>

              {/* Quick Amount Presets */}
              <div className="flex gap-2 pt-1">
                {[100, 500, 1000, 2500].map(amt => (
                  <Button 
                    key={amt} 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPresetAmount(amt)}
                    className="h-7 px-2 text-[11px] font-mono bg-secondary/50 hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    +₹{amt}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="glass">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-xs">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grocery shopping at D-Mart" className="bg-background" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold h-10 shadow-lg shadow-rose-500/20">
          Save Expense
        </Button>
      </form>
    </Form>
  );
}
