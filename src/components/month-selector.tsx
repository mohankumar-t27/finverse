'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSelectorProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export default function MonthSelector({ selectedDate, onSelectedDateChange }: MonthSelectorProps) {
  const handlePrevMonth = () => {
    onSelectedDateChange(subMonths(selectedDate, 1));
  };
  
  const handleNextMonth = () => {
    onSelectedDateChange(addMonths(selectedDate, 1));
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/40 border border-border/50 backdrop-blur-md shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-xl hover:bg-background/80 text-muted-foreground hover:text-foreground transition-all" 
        onClick={handlePrevMonth}
        title="Previous Month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    
      <div className="w-[140px] px-2 text-center font-bold text-xs sm:text-sm tracking-tight h-8 flex items-center justify-center gap-1.5 text-foreground font-mono">
        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
        {format(selectedDate, 'MMM yyyy')}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-xl hover:bg-background/80 text-muted-foreground hover:text-foreground transition-all" 
        onClick={handleNextMonth}
        title="Next Month"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
