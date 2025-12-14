'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from "@/components/ui/drawer"
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
  description: z.string().min(1, 'Description is required'),
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
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense. Click save when you're done.
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
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader className="text-left">
            <DrawerTitle>Add New Expense</DrawerTitle>
            <DrawerDescription>
                Enter the details of your expense. Click save when you're done.
            </DrawerDescription>
            </DrawerHeader>
            <ExpenseForm categories={categories} onAddExpense={onAddExpense} setIsOpen={setIsOpen} className="px-4"/>
            <DrawerFooter className="pt-2">
                {/* The form has its own submit button */}
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
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
      category: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof expenseSchema>) {
    onAddExpense(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Coffee with friends" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Save Expense</Button>
      </form>
    </Form>
  )
}
