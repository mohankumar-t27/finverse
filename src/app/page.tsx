'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user } = useAuth();
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  return (
    <main>
      {user ? (
        <Dashboard
          key={user.uid}
          triggerMigration={!migrationCompleted}
          onMigrationCompleted={() => setMigrationCompleted(true)}
        />
      ) : (
        <Login />
      )}
    </main>
  );
}
