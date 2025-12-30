'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Copy } from 'lucide-react';
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
} from "@/components/ui/drawer"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Budget } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';


interface BudgetSetupDialogProps {
  budgets: Budget[];
  onUpdateBudgets: (budgets: Budget[]) => void;
  onCopyPreviousBudgets: () => void;
  canCopyPreviousBudgets: boolean;
}

export default function BudgetSetupDialog({ 
  budgets: initialBudgets, 
  onUpdateBudgets,
  onCopyPreviousBudgets,
  canCopyPreviousBudgets 
}: BudgetSetupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const showCopyButton = canCopyPreviousBudgets && initialBudgets.length === 0;

  const formProps = {
    initialBudgets,
    onUpdateBudgets,
    onCopyPreviousBudgets,
    showCopyButton,
    setIsOpen,
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Set Budgets
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle>Set Monthly Budgets</DialogTitle>
            <DialogDescription>
              Adjust your budget for each category.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm {...formProps} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Set Budgets
          </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Set Monthly Budgets</DrawerTitle>
          <DrawerDescription>
              Adjust your budget for each category.
          </DrawerDescription>
        </DrawerHeader>
        <BudgetForm {...formProps} className="px-4" />
        <DrawerFooter className="pt-2">
           {/* The form has its own submit button */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface BudgetFormProps {
  initialBudgets: Budget[];
  onUpdateBudgets: (budgets: Budget[]) => void;
  onCopyPreviousBudgets: () => void;
  showCopyButton: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

function BudgetForm({ 
  initialBudgets, 
  onUpdateBudgets, 
  onCopyPreviousBudgets,
  showCopyButton,
  setIsOpen, 
  className 
}: BudgetFormProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    setBudgets(initialBudgets);
  }, [initialBudgets]);

  const handleBudgetChange = (category: string, newBudgetValue: string) => {
    const value = parseFloat(newBudgetValue);
    if (!isNaN(value)) {
      setBudgets(budgets.map(b => b.category === category ? { ...b, budget: value } : b));
    } else if (newBudgetValue === '') {
       setBudgets(budgets.map(b => b.category === category ? { ...b, budget: 0 } : b));
    }
  };
  
  const handleAddNewCategory = () => {
    if (newCategory && !budgets.some(b => b.category === newCategory)) {
      setBudgets([...budgets, { category: newCategory, budget: 0 }]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setBudgets(budgets.filter(b => b.category !== category));
  };
  
  const handleSaveChanges = () => {
    onUpdateBudgets(budgets);
    setIsOpen(false);
  };
  
  const handleCopyClick = () => {
    onCopyPreviousBudgets();
    // Keep dialog open for user to review
  }

  return (
    <div className={cn("flex-1 flex flex-col min-h-0", className)}>
      {showCopyButton && (
          <div className="mb-4">
              <Button variant="outline" className="w-full" onClick={handleCopyClick}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Previous Month's Budgets
              </Button>
          </div>
      )}
      <div className="flex-1 overflow-auto -mx-6 px-6">
        <ScrollArea className="h-full pr-4">
            <div className="space-y-4 py-4">
            {budgets.map((budget) => {
                const Icon = getCategoryIcon(budget.category);
                return (
                <div key={budget.category} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor={`budget-${budget.category}`} className="flex-1 whitespace-nowrap">
                    {budget.category}
                    </Label>
                    <Input
                    id={`budget-${budget.category}`}
                    type="number"
                    value={budget.budget}
                    onChange={(e) => handleBudgetChange(budget.category, e.target.value)}
                    className="w-28"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleRemoveCategory(budget.category)}>
                    <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                )
            })}
             {budgets.length === 0 && !showCopyButton && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No budgets set for this month.</p>
                    <p>Add a new category below to get started.</p>
                </div>
             )}
            </div>
        </ScrollArea>
      </div>
      <div className="flex-shrink-0 pt-4">
        <div className="flex items-center gap-2">
            <Input 
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNewCategory()}
            />
            <Button onClick={handleAddNewCategory} variant="outline">
            <Plus className="h-4 w-4 mr-2"/>
            Add
            </Button>
        </div>
        <div className="pt-4">
            <Button onClick={handleSaveChanges} className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
