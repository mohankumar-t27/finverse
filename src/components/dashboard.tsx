'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Header from '@/components/header';
import MonthlyDashboard from './monthly-dashboard';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
      />
        <main className="flex-1 p-4 md:p-8 space-y-8">
            <MonthlyDashboard 
              key={format(selectedDate, 'yyyy-MM')} 
              selectedDate={selectedDate} 
            />
        </main>
    </div>
  );
}
