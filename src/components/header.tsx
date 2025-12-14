'use client';

import { IndianRupee } from 'lucide-react';
import MonthSelector from './month-selector';

interface HeaderProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export default function Header({ selectedDate, onSelectedDateChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-auto min-h-16 flex-col items-start gap-4 p-4 md:h-16 md:flex-row md:items-center md:justify-between md:px-6 border-b bg-card/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-4">
        <div className="flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-primary" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground font-headline">
            MokiSpends
            </h1>
        </div>
      </div>
      
      <div className="flex w-full items-center justify-between gap-2 md:w-auto">
        <MonthSelector selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
      </div>
    </header>
  );
}
