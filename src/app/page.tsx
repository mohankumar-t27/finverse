'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();
  const [migrationTriggered, setMigrationTriggered] = useState(false);

  return (
    <main>
      {user ? (
        <Dashboard
          key={user.uid} 
          triggerMigration={!migrationTriggered}
          onMigrationCompleted={() => setMigrationTriggered(true)}
        />
      ) : (
        <Login />
      )}
    </main>
  );
}
