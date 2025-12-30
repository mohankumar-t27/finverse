'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user } = useAuth();

  return (
    <main>
      {user ? <Dashboard key={user.uid} /> : <Login />}
    </main>
  );
}
