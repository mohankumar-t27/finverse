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
  const [isLoading, setIsLoading] = useState(true);
  const [redirectChecked, setRedirectChecked] = useState(false);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);

    const unsubscribe = onAuthStateChanged(instances.auth, (user) => {
      // This is the most reliable point to check for a redirect result.
      // It ensures Firebase Auth is fully initialized.
      if (!redirectChecked) {
        getRedirectResult(instances.auth)
          .catch((error) => {
            console.error("Error processing redirect result", error);
          })
          .finally(() => {
            setRedirectChecked(true); 
            setIsLoading(false); // Now we are ready to render the app.
          });
      }
    });

    return () => unsubscribe();
  }, [redirectChecked]);

  if (!firebase || isLoading || !redirectChecked) {
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
