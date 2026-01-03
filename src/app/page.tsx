'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    // The FirebaseClientProvider handles the initial loading screen.
    // Returning null here prevents any flickering while the auth state is being resolved
    // by the provider.
    return null;
  }

  return (
    <main>
      {user ? <Dashboard key={user.uid} /> : <Login />}
    </main>
  );
}
