'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Copy, Sparkles, SlidersHorizontal } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Budget } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { getCategoryIcon } from '@/lib/icons';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface BudgetSetupDialogProps {
  budgets: Budget[];
  onUpdateBudgets: (updatedBudgets: Budget[], originalCategories: string[]) => void;
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

  const originalCategories = initialBudgets.map(b => b.category);

  const formProps = {
    initialBudgets,
    onUpdateBudgets,
    onCopyPreviousBudgets,
    showCopyButton,
    setIsOpen,
    originalCategories,
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-background/60 hover:bg-secondary border-border/80 rounded-xl font-semibold shadow-sm flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
            Set Budgets
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg glass flex flex-col h-[75vh] border-border/60 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Set Monthly Budgets
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define spending limits for each category to track your goals.
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
        <Button variant="outline" className="bg-background/60 hover:bg-secondary border-border/80 rounded-xl font-semibold shadow-sm flex items-center gap-1.5 px-2.5 sm:px-4 text-xs sm:text-sm shrink-0">
          <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400 shrink-0" />
          <span className="truncate">Budgets</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass border-t border-border/60">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            Set Monthly Budgets
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            Define spending limits for each category.
          </DrawerDescription>
        </DrawerHeader>
        <BudgetForm {...formProps} className="px-4" />
        <DrawerFooter className="pt-2" />
      </DrawerContent>
    </Drawer>
  );
}

interface BudgetFormProps {
  initialBudgets: Budget[];
  onUpdateBudgets: (updatedBudgets: Budget[], originalCategories: string[]) => void;
  originalCategories: string[];
  onCopyPreviousBudgets: () => void;
  showCopyButton: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

function BudgetForm({ 
  initialBudgets, 
  onUpdateBudgets, 
  originalCategories,
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
    if (newCategory.trim() && !budgets.some(b => b.category.toLowerCase() === newCategory.trim().toLowerCase())) {
      setBudgets([...budgets, { category: newCategory.trim(), budget: 0 }]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setBudgets(budgets.filter(b => b.category !== category));
  };
  
  const handleSaveChanges = () => {
    onUpdateBudgets(budgets, originalCategories);
    setIsOpen(false);
  };
  
  const handleCopyClick = () => {
    onCopyPreviousBudgets();
  };

  return (
    <div className={cn("flex-1 flex flex-col min-h-0", className)}>
      {showCopyButton && (
        <div className="mb-4">
          <Button variant="outline" className="w-full bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-semibold" onClick={handleCopyClick}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Previous Month's Budgets
          </Button>
        </div>
      )}
      
      <div className="flex-1 overflow-auto -mx-6 px-6">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3 py-2">
            {budgets.map((budget) => {
              const Icon = getCategoryIcon(budget.category);
              return (
                <div key={budget.category} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-border/40">
                  <div className="p-2 rounded-lg bg-background text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <Label htmlFor={`budget-${budget.category}`} className="flex-1 font-semibold text-sm">
                    {budget.category}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono text-muted-foreground">₹</span>
                    <Input
                      id={`budget-${budget.category}`}
                      type="number"
                      value={budget.budget}
                      onChange={(e) => handleBudgetChange(budget.category, e.target.value)}
                      className="w-28 pl-6 h-8 text-xs font-mono bg-background border-border"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-rose-500" onClick={() => handleRemoveCategory(budget.category)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            
            {budgets.length === 0 && !showCopyButton && (
              <div className="text-center text-muted-foreground py-8">
                <p className="font-semibold text-sm">No budget categories set.</p>
                <p className="text-xs text-muted-foreground">Add your first category below.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0 pt-4 border-t border-border/40 space-y-3">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="New category name (e.g. Dining)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNewCategory()}
            className="h-9 text-xs bg-background"
          />
          <Button onClick={handleAddNewCategory} variant="outline" size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1"/>
            Add
          </Button>
        </div>

        <Button onClick={handleSaveChanges} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-10 shadow-lg shadow-cyan-500/20">
          Save All Budgets
        </Button>
      </div>
    </div>
  );
}
