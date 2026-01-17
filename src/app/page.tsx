'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();

  console.log('[Home Page] Render. Loading:', loading, 'User:', user?.uid || 'null');

  if (loading) {
    console.log('[Home Page] Auth is loading, rendering null (or loader from provider).');
    // The FirebaseClientProvider is already showing a loader,
    // so we can return null or a minimal skeleton here.
    return null;
  }

  if (user) {
    console.log('[Home Page] User is present. Rendering Dashboard.');
     return <main><Dashboard key={user.uid} /></main>;
  } else {
    console.log('[Home Page] User is absent. Rendering Login.');
     return <main><Login /></main>;
  }
}
