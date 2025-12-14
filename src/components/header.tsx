'use client';

import { IndianRupee } from 'lucide-react';
import MonthSelector from './month-selector';

interface HeaderProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

export default function Header({ selectedDate, onSelectedDateChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-auto flex-col items-start gap-4 border-b bg-card/80 p-4 backdrop-blur-sm sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start sm:gap-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-xl">
            MokiSpends
          </h1>
        </div>
      </div>
      
      <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
        <MonthSelector selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} />
      </div>
    </header>
  );
}
