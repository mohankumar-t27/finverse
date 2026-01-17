'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient';
import { Loader2 } from 'lucide-react';

export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [{ app, auth, firestore }] = useState(initializeFirebase());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is the single source of truth.
    // It correctly handles the redirect flow by waiting for it to complete before firing.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Show a full-screen loader while waiting for the initial auth state.
  if (loading) {
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  // Once loading is false, the auth state is definitive.
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore} user={user} loading={loading}>
      {children}
    </FirebaseProvider>
  );
}
