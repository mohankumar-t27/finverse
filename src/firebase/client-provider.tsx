'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { type FirebaseApp } from 'firebase/app';
import { getAuth, getRedirectResult, onAuthStateChanged, type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient';
import { Loader2 } from 'lucide-react';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);

    // This effect runs once to determine the initial auth state, including
    // processing any results from a sign-in redirect.
    const unsubscribe = onAuthStateChanged(instances.auth, (user) => {
      // The first time this runs, it will have the user from a successful redirect
      // or will be null. Now we know Firebase Auth is initialized.
      
      // We explicitly check for a redirect result.
      getRedirectResult(instances.auth)
        .catch((error) => {
          console.error("Error processing redirect result", error);
        })
        .finally(() => {
          // Whether the redirect succeeded, failed, or was not initiated,
          // the initial auth check is now complete.
          setLoading(false);
        });
      
      // We only need this for the initial check, so we unsubscribe immediately.
      // The `useAuth` hook will have its own persistent `onAuthStateChanged` listener.
      unsubscribe();
    });

    return () => unsubscribe();
  }, []);

  if (!firebase || loading) {
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
