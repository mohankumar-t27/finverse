'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { type FirebaseApp } from 'firebase/app';
import { getAuth, getRedirectResult, type Auth } from 'firebase/auth';
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
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);

  useEffect(() => {
    console.log('[FirebaseClientProvider] Initializing Firebase and checking for redirect result.');
    const instances = initializeFirebase();
    setFirebase(instances);

    getRedirectResult(instances.auth)
      .then((result) => {
        if (result) {
          console.log('[FirebaseClientProvider] getRedirectResult success: User credential found.', result.user);
        } else {
          console.log('[FirebaseClientProvider] getRedirectResult success: No user credential from redirect.');
        }
      })
      .catch((error) => {
        console.error("[FirebaseClientProvider] Error processing redirect result", error);
      })
      .finally(() => {
        console.log('[FirebaseClientProvider] Finished processing redirect. Rendering children.');
        setIsProcessingRedirect(false);
      });
  }, []);

  if (!firebase || isProcessingRedirect) {
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
