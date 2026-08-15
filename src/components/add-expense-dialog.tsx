'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, ShoppingBag, Sparkles, Check, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
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
import type { Expense } from '@/lib/types';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getCategoryIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Please enter an amount greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Please enter a brief description'),
});

interface AddExpenseDialogProps {
  categories: string[];
  onAddExpense: (expense: Omit<Expense, 'id'|'date'>) => void;
}

const QUICK_SUGGESTIONS: Record<string, string[]> = {
  Food: ["Lunch", "Dinner", "Coffee", "Swiggy / Zomato", "Snacks"],
  Dining: ["Restaurant", "Cafe", "Dinner Out", "Swiggy / Zomato"],
  Groceries: ["Supermarket", "D-Mart", "Vegetables & Fruits", "Milk & Dairy"],
  Transportation: ["Fuel / Petrol", "Uber / Ola", "Metro / Bus", "Auto"],
  Shopping: ["Clothing", "Electronics", "Amazon / Flipkart", "Gifts"],
  Bills: ["Electricity", "Internet / Wi-Fi", "Mobile Recharge", "Water Bill"],
  Entertainment: ["Movie Tickets", "Netflix / Prime", "Gaming", "Outing"],
  Health: ["Medicines", "Doctor Visit", "Pharmacy", "Lab Test"],
};

export default function AddExpenseDialog({ categories, onAddExpense }: AddExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerButton = (
    <Button className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-105 border border-white/20">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Expense
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[480px] bg-slate-950/95 border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-6">
          <DialogHeader className="pb-2 border-b border-white/10">
            <DialogTitle className="text-xl font-bold flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <span className="text-foreground">Log New Expense</span>
                <span className="block text-xs font-normal text-muted-foreground mt-0.5">Quickly record your outlay against monthly budgets</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm categories={categories} onAddExpense={onAddExpense} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="bg-slate-950/95 border-t border-white/10 backdrop-blur-2xl">
        <DrawerHeader className="text-left pb-2 border-b border-white/10">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="text-foreground">Log New Expense</span>
              <span className="block text-xs font-normal text-muted-foreground mt-0.5">Record your spending</span>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <ExpenseForm categories={categories} onAddExpense={onAddExpense} setIsOpen={setIsOpen} className="px-4 py-3" />
        <DrawerFooter className="pt-0" />
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
      amount: '' as any,
      category: categories[0] || '',
      description: '',
    },
  });

  const activeCategory = form.watch('category');
  const activeAmount = form.watch('amount');

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      form.setValue('category', categories[0]);
    }
  }, [categories, activeCategory, form]);

  function onSubmit(values: z.infer<typeof expenseSchema>) {
    onAddExpense(values);
    form.reset();
    setIsOpen(false);
  }

  const addPresetAmount = (increment: number) => {
    const current = Number(form.getValues('amount')) || 0;
    form.setValue('amount', current + increment, { shouldValidate: true });
  };

  const setSuggestionDescription = (desc: string) => {
    form.setValue('description', desc, { shouldValidate: true });
  };

  const suggestions = QUICK_SUGGESTIONS[activeCategory] || QUICK_SUGGESTIONS["Food"] || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4 pt-2", className)}>
        
        {/* 1. Large Amount Input */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-rose-400">Expense Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xl font-bold font-mono text-rose-400">₹</span>
                  <Input 
                    type="number" 
                    step="any" 
                    placeholder="0" 
                    autoFocus
                    className="pl-9 text-2xl font-black font-mono h-12 bg-slate-900/80 border-slate-700/80 text-white rounded-xl focus:ring-2 focus:ring-rose-500/50" 
                    {...field} 
                  />
                </div>
              </FormControl>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[50, 100, 500, 1000, 2000].map(amt => (
                  <Button 
                    key={amt} 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addPresetAmount(amt)}
                    className="h-7 px-2.5 text-xs font-mono font-bold bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/30 rounded-lg transition-all"
                  >
                    +₹{amt}
                  </Button>
                ))}
                {Number(activeAmount) > 0 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => form.setValue('amount', '' as any)}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-rose-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Visual Category Selector Chips */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                <span>Select Category</span>
                <span className="text-[10px] text-muted-foreground font-normal">Tap to pick</span>
              </FormLabel>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[140px] overflow-y-auto p-1 pr-2 rounded-xl bg-slate-900/40 border border-white/5">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const Icon = getCategoryIcon(cat);
                    const isSelected = field.value === cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => form.setValue('category', cat, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all duration-200 text-left relative overflow-hidden",
                          isSelected
                            ? "bg-gradient-to-r from-rose-500/20 to-amber-500/20 border-rose-500/50 text-white shadow-md shadow-rose-500/10"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-lg shrink-0", isSelected ? "bg-rose-500/30 text-rose-300" : "bg-slate-800 text-slate-400")}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate flex-1">{cat}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full py-4 text-center text-xs text-muted-foreground">
                    No budget categories defined yet.
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. Description with Quick Suggestions */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-emerald-400">Description</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Swiggy order or D-Mart groceries" 
                  className="bg-slate-900/80 border-slate-700/80 text-sm h-10 rounded-xl" 
                  {...field} 
                />
              </FormControl>

              {/* Quick suggestions */}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3 text-cyan-400" /> Quick tags:
                  </span>
                  {suggestions.map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setSuggestionDescription(sug)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 transition-colors border border-white/5"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-bold text-sm shadow-xl shadow-rose-500/25 rounded-xl transition-all duration-300 hover:scale-[1.01]"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Save Expense Entry
        </Button>
      </form>
    </Form>
  );
}
