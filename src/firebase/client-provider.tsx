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
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    console.log('[FirebaseClientProvider] Mounting and initializing Firebase.');
    const instances = initializeFirebase();
    setFirebase(instances);

    const auth = getAuth(instances.app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[FirebaseClientProvider] onAuthStateChanged fired. User:', user?.uid || null);
      
      console.log('[FirebaseClientProvider] Calling getRedirectResult...');
      getRedirectResult(auth)
        .then((result) => {
          if (result) {
            console.log('[FirebaseClientProvider] getRedirectResult success. User credential found:', result.user.uid);
          } else {
            console.log('[FirebaseClientProvider] getRedirectResult success: No user credential from redirect.');
          }
        })
        .catch((error) => {
          console.error("[FirebaseClientProvider] Error getting redirect result:", error);
        })
        .finally(() => {
          console.log('[FirebaseClientProvider] Redirect check complete. Setting isAuthReady to true.');
          setIsAuthReady(true);
        });
        
      // We only need to run this once on initial load to check for the redirect.
      unsubscribe();
    });

    return () => {
        console.log('[FirebaseClientProvider] Unmounting.');
        unsubscribe();
    }
  }, []);

  if (!isAuthReady || !firebase) {
    console.log('[FirebaseClientProvider] Auth not ready or Firebase not initialized. Rendering loader.');
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  console.log('[FirebaseClientProvider] Auth is ready. Rendering children.');
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
