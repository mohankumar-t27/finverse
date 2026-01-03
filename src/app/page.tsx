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
    // The FirebaseClientProvider is already showing a loading screen for the initial load.
    // This check is mainly for transitions after the initial load.
    // Returning null is fine as the main loader is handling the UI.
    console.log('[Home Page] Auth state is loading, rendering nothing yet.');
    return null;
  }

  return (
    <main>
      {user ? <Dashboard key={user.uid} /> : <Login />}
    </main>
  );
}
