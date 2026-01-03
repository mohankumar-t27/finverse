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

  useEffect(() => {
    console.log('[FirebaseClientProvider] Mounting and initializing Firebase...');
    const instances = initializeFirebase();
    setFirebase(instances);

    let isSubscribed = true;
    let redirectCheckPerformed = false;

    const unsubscribe = onAuthStateChanged(instances.auth, (user) => {
      if (!isSubscribed) return;
      
      console.log('[FirebaseClientProvider] onAuthStateChanged triggered. User:', user?.uid);

      if (!redirectCheckPerformed) {
        redirectCheckPerformed = true;
        console.log('[FirebaseClientProvider] Auth is ready, now checking for redirect result...');
        
        getRedirectResult(instances.auth)
          .then((result) => {
            console.log('[FirebaseClientProvider] getRedirectResult success:', result);
            if (result && result.user) {
              console.log('[FirebaseClientProvider] User found in redirect result:', result.user.uid);
              // The onAuthStateChanged listener will handle setting the user,
              // so we just need to ensure the UI waits.
            } else {
              console.log('[FirebaseClientProvider] No user found in redirect result.');
            }
          })
          .catch((error) => {
            console.error('[FirebaseClientProvider] Error processing redirect result:', error);
          })
          .finally(() => {
            console.log('[FirebaseClientProvider] Finished processing redirect. Setting auth as ready.');
            if (isSubscribed) {
              setIsAuthReady(true);
            }
          });
      } else if (!user) {
        // If it's not the first check and there's no user, we are ready.
         if (isSubscribed) {
            setIsAuthReady(true);
         }
      } else {
        // If user is already present, we are ready.
         if (isSubscribed) {
            setIsAuthReady(true);
         }
      }
    });

    return () => {
        isSubscribed = false;
        console.log('[FirebaseClientProvider] Unsubscribing from onAuthStateChanged.');
        unsubscribe();
    }
  }, []);
  
  const showLoader = !isAuthReady;

  if (showLoader) {
    console.log(`[FirebaseClientProvider] Showing loader because auth is not ready yet.`);
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  console.log('[FirebaseClientProvider] Auth is ready. Rendering children.');
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
