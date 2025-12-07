
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSelectorProps {
    selectedDate: Date;
    onSelectedDateChange: (date: Date) => void;
}

export default function MonthSelector({ selectedDate, onSelectedDateChange }: MonthSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleMonthChange = (date: Date | undefined) => {
        if (date) {
            onSelectedDateChange(date);
            setIsOpen(false);
        }
    }

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
      
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start text-left font-normal h-9">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'MMMM yyyy')}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleMonthChange}
                    initialFocus
                    defaultMonth={selectedDate}
                    captionLayout="dropdown-buttons" 
                    fromYear={2020}
                    toYear={new Date().getFullYear() + 5}
                />
            </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
        </Button>
    </div>
  );
}
