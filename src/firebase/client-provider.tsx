'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { getAuth, onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient';
import { Loader2 } from 'lucide-react';

export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [{ app, auth, firestore }] = useState(initializeFirebase());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[FirebaseClientProvider] Effect started.');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`[FirebaseClientProvider] onAuthStateChanged fired. User: ${user?.uid || 'null'}.`);
      setUser(user);
      console.log(`[FirebaseClientProvider] Setting loading to false.`);
      setLoading(false); // Definitive state is known, stop loading.
    });

    console.log('[FirebaseClientProvider] Calling getRedirectResult to process potential sign-in.');
    getRedirectResult(auth).catch((error) => {
      // This is just to process the redirect. The onAuthStateChanged listener
      // above will handle the user state update. We just log any errors here.
      console.error('[FirebaseClientProvider] Error processing redirect result:', error);
    });

    return () => {
      console.log('[FirebaseClientProvider] Unsubscribing from onAuthStateChanged.');
      unsubscribe();
    };
  }, [auth]);

  if (loading) {
    console.log('[FirebaseClientProvider] In loading state, rendering loader.');
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  console.log('[FirebaseClientProvider] Loading complete. Rendering provider with children.');
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore} user={user} loading={loading}>
      {children}
    </FirebaseProvider>
  );
}
