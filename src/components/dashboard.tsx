'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Header from './header';
import MonthlyDashboard from './monthly-dashboard';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col min-h-screen">
      <MonthlyDashboard
        key={format(selectedDate, 'yyyy-MM')}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
      />
    </div>
  );
}
