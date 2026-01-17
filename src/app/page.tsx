'use client';

import Dashboard from '@/components/dashboard';
import Login from '@/components/login';
import { useAuth } from '@/firebase';

export default function Home() {
  const { user, loading } = useAuth();
  
  console.log(`[Home Page] Rendering with auth state: { loading: ${loading}, user: ${user?.uid || 'null'} }`);

  if (loading) {
    console.log('[Home Page] Auth is loading, rendering null (provider should show loader).');
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
