'use client';

import React, { useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { type FirebaseApp } from 'firebase/app';
import { getRedirectResult, type Auth } from 'firebase/auth';
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
    const instances = initializeFirebase();
    setFirebase(instances);

    // This effect should only run once on mount to handle the redirect result.
    getRedirectResult(instances.auth)
      .catch((error) => {
        // Handle any errors from the redirect result.
        console.error('Error processing redirect result:', error);
      })
      .finally(() => {
        // Whether it succeeds or fails, we're done processing the redirect.
        setIsProcessingRedirect(false);
      });
  }, []);
  
  // Show loader while Firebase is initializing OR while processing a potential redirect.
  if (!firebase || isProcessingRedirect) {
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <Loader2 className="h-12 w-12 animate-spin" />
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
