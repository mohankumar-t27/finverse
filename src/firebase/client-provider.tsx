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

    // Use onAuthStateChanged to know when Firebase Auth is ready.
    const unsubscribe = onAuthStateChanged(instances.auth, (user) => {
      // Check for redirect result only once after the initial auth state is determined.
      getRedirectResult(instances.auth)
        .catch((error) => {
          console.error("Error processing redirect result", error);
        })
        .finally(() => {
          // Whether the redirect succeeded or failed, we are now done with the initial load.
          setLoading(false);
        });
    });

    // The initial onAuthStateChanged call will handle the redirect,
    // so we can unsubscribe immediately to prevent it from running again on user state changes here.
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
