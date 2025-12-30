
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSelectorProps {
    selectedDate: Date;
    onSelectedDateChange: (date: Date) => void;
}

export default function MonthSelector({ selectedDate, onSelectedDateChange }: MonthSelectorProps) {
    
    const handlePrevMonth = () => {
        onSelectedDateChange(subMonths(selectedDate, 1));
    }
    
    const handleNextMonth = () => {
        onSelectedDateChange(addMonths(selectedDate, 1));
    }

  return (
    <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
        </Button>
      
        <div className="w-[150px] text-center font-semibold h-9 flex items-center justify-center">
            {format(selectedDate, 'MMMM yyyy')}
        </div>

        <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
        </Button>
    </div>
  );
}
