'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    // The FirebaseClientProvider is already showing a full-screen loader.
    // Returning null here prevents any content from flashing on screen
    // while the final auth state is being passed down.
    return null;
  }

  return (
    <main>
      {user ? <Dashboard key={user.uid} /> : <Login />}
    </main>
  );
}
