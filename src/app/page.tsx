'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // This effect is safe to leave for debugging or can be removed.
  }, [user, loading]);

  if (loading) {
    // The FirebaseClientProvider is responsible for the main loading UI.
    // Returning null here prevents a flash of the login page while auth is resolving.
    return null;
  }

  return (
    <main>
      {user ? <Dashboard key={user.uid} /> : <Login />}
    </main>
  );
}
