'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();

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
