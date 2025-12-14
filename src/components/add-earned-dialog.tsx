'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Banknote, PlusCircle } from 'lucide-react';
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
          <Button>
            <Banknote className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Income</DialogTitle>
            <DialogDescription>
              Enter the details of your income. Click save when you're done.
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
        <Button>
            <Banknote className="mr-2 h-4 w-4" />
            Add Income
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Income</DrawerTitle>
          <DrawerDescription>
            Enter the details of your income. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <EarnedForm onAddEarned={onAddEarned} setIsOpen={setIsOpen} className="px-4" />
        <DrawerFooter className="pt-2">
            {/* The form has its own submit button */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly Salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Income</Button>
          </form>
        </Form>
    );
}