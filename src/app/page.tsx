'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    // The FirebaseClientProvider is already showing a loader,
    // so we can return null or a minimal skeleton here.
    return null;
  }

  if (user) {
     return <main><Dashboard key={user.uid} /></main>;
  } else {
     return <main><Login /></main>;
  }
}
