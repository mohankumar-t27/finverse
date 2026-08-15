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
    // Process mobile redirect results immediately on mount
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.error('[FirebaseClientProvider] Error processing redirect result:', err);
      });

    // Single source of truth listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Show a full-screen loader while waiting for initial auth state.
  if (loading) {
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore} user={user} loading={loading}>
      {children}
    </FirebaseProvider>
  );
}
