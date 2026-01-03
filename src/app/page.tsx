'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('[Home Page] Auth state change:', { user, loading });
  }, [user, loading]);

  if (loading) {
    // The FirebaseClientProvider is responsible for the main loading UI.
    // Returning null here prevents a flash of the login page while auth is resolving.
    console.log('[Home Page] Auth is loading, rendering null.');
    return null;
  }

  console.log(`[Home Page] Auth loaded. User is ${user ? 'present' : 'absent'}. Rendering ${user ? 'Dashboard' : 'Login'}.`);
  return (
    <main>
      {user ? <Dashboard key={user.uid} /> : <Login />}
    </main>
  );
}
