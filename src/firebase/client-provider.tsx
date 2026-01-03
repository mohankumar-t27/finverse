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
    console.log('[FirebaseClientProvider] Mounting and initializing Firebase...');
    const instances = initializeFirebase();
    setFirebase(instances);

    console.log('[FirebaseClientProvider] Checking for redirect result...');
    getRedirectResult(instances.auth)
      .then((result) => {
        console.log('[FirebaseClientProvider] getRedirectResult success:', result);
        if (result && result.user) {
          console.log('[FirebaseClientProvider] User found in redirect result:', result.user.uid);
        } else {
          console.log('[FirebaseClientProvider] No user found in redirect result.');
        }
      })
      .catch((error) => {
        console.error('[FirebaseClientProvider] Error processing redirect result:', error);
      })
      .finally(() => {
        console.log('[FirebaseClientProvider] Finished processing redirect. Setting isProcessingRedirect to false.');
        setIsProcessingRedirect(false);
      });
  }, []);
  
  const showLoader = !firebase || isProcessingRedirect;

  if (showLoader) {
    console.log(`[FirebaseClientProvider] Showing loader because: firebase not ready (${!firebase}), or processing redirect (${isProcessingRedirect})`);
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  console.log('[FirebaseClientProvider] Firebase ready and redirect processed. Rendering children.');
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
