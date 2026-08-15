'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Banknote, TrendingUp } from 'lucide-react';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Earned } from '@/lib/types';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';

const earnedSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
});

interface AddEarnedDialogProps {
  onAddEarned: (earned: Omit<Earned, 'id'|'date'>) => void;
}

export default function AddEarnedDialog({ onAddEarned }: AddEarnedDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20">
            <Banknote className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] glass border-border/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Add New Income
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record salary, freelance earnings, or secondary income streams.
            </DialogDescription>
          </DialogHeader>
          <EarnedForm onAddEarned={onAddEarned} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 px-2.5 sm:px-4 text-xs sm:text-sm shrink-0">
          <Banknote className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          <span className="truncate">+ Income</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass border-t border-border/60">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Add New Income
          </DrawerTitle>
          <DialogDescription className="text-xs">
            Record earnings or secondary income.
          </DialogDescription>
        </DrawerHeader>
        <EarnedForm onAddEarned={onAddEarned} setIsOpen={setIsOpen} className="px-4" />
        <DrawerFooter className="pt-2" />
      </DrawerContent>
    </Drawer>
  );
}

interface EarnedFormProps {
  onAddEarned: (earned: Omit<Earned, 'id'|'date'>) => void;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

function EarnedForm({ onAddEarned, setIsOpen, className }: EarnedFormProps) {
  const form = useForm<z.infer<typeof earnedSchema>>({
    resolver: zodResolver(earnedSchema),
    defaultValues: {
      amount: 0,
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof earnedSchema>) {
    onAddEarned(values);
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
                {[5000, 10000, 25000, 50000].map(amt => (
                  <Button 
                    key={amt} 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPresetAmount(amt)}
                    className="h-7 px-2 text-[11px] font-mono bg-secondary/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                  >
                    +₹{(amt / 1000).toFixed(0)}k
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Source Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Monthly Salary, Dividend, Freelance" className="bg-background" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold h-10 shadow-lg shadow-emerald-500/20">
          Save Income Entry
        </Button>
      </form>
    </Form>
  );
}