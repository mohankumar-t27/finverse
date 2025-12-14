'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Budget } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';
import { useMediaQuery } from '@/hooks/use-media-query';


interface BudgetSetupDialogProps {
  budgets: Budget[];
  onUpdateBudgets: (budgets: Budget[]) => void;
}

export default function BudgetSetupDialog({ budgets: initialBudgets, onUpdateBudgets }: BudgetSetupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Set Budgets
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Monthly Budgets</DialogTitle>
            <DialogDescription>
              Adjust your budget for each category.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm initialBudgets={initialBudgets} onUpdateBudgets={onUpdateBudgets} setIsOpen={setIsOpen}/>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
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
        <BudgetForm initialBudgets={initialBudgets} onUpdateBudgets={onUpdateBudgets} setIsOpen={setIsOpen} className="px-4" />
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
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

function BudgetForm({ initialBudgets, onUpdateBudgets, setIsOpen, className }: BudgetFormProps) {
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

  return (
    <div className={className}>
      <ScrollArea className="max-h-[50vh] pr-4">
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
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 pt-4">
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
  )
}
