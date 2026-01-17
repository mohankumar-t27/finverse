'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    // The FirebaseClientProvider is showing a full-screen loader,
    // so we can return null here to prevent any flash of content.
    return null;
  }

  if (user) {
     return <main><Dashboard key={user.uid} /></main>;
  } else {
     return <main><Login /></main>;
  }
}
