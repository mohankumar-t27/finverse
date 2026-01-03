'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { type FirebaseApp } from 'firebase/app';
import { getRedirectResult, onAuthStateChanged, type Auth } from 'firebase/auth';
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
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);

    // First, process the potential redirect result.
    getRedirectResult(instances.auth)
      .then((result) => {
        if (result && result.user) {
          // User signed in via redirect.
          // onAuthStateChanged will handle the user state update.
        }
        // Whether there was a user or not, the redirect processing is done.
        setIsProcessingRedirect(false);
      })
      .catch((error) => {
        console.error('[FirebaseClientProvider] Error processing redirect result:', error);
        setIsProcessingRedirect(false);
      });

    // Separately, listen for auth state changes.
    // This will fire after getRedirectResult has set the initial user.
    const unsubscribe = onAuthStateChanged(instances.auth, (user) => {
      // Once this listener fires for the first time, we know auth is ready.
      if (!isAuthReady) {
        setIsAuthReady(true);
      }
    });

    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Show loader until both redirect is processed AND initial auth state is known.
  const showLoader = isProcessingRedirect || !isAuthReady;

  if (showLoader) {
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  // firebase will be defined if showLoader is false
  return (
    <FirebaseProvider
      app={firebase!.app}
      auth={firebase!.auth}
      firestore={firebase!.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
