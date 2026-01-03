'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getRedirectResult, type Auth } from 'firebase/auth';
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

    const auth = getAuth(instances.app);
    
    // onAuthStateChanged is the most reliable listener for when auth is ready.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This is our definitive signal that Firebase has checked the initial state.
      // Now, we can safely check for a redirect result.
      getRedirectResult(auth)
        .catch((error) => {
          console.error("Error processing redirect result", error);
        })
        .finally(() => {
          // Whether the redirect succeeded, failed, or was not initiated,
          // the entire initial auth process is now complete. We can show the app.
          setLoading(false);
        });

      // We only need this complex check for the very initial load.
      // The `useAuth` hook will have its own simpler listener for subsequent changes.
      unsubscribe();
    });

    return () => unsubscribe();
  }, []);

  if (loading || !firebase) {
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
