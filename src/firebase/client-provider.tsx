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

// This component acts as a gatekeeper. It ensures that Firebase is initialized
// and the initial authentication state (including any redirects) is resolved
// before the rest of the app is rendered.
export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // Tracks if the initial auth check is complete

  useEffect(() => {
    // Initialize Firebase services
    const instances = initializeFirebase();
    setFirebase(instances);

    const auth = getAuth(instances.app);

    // `onAuthStateChanged` is the most reliable way to know when Firebase
    // has finished its initial check. Inside, we can safely check for a redirect.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getRedirectResult(auth)
        .catch((error) => {
          console.error("Error getting redirect result:", error);
        })
        .finally(() => {
          // The initial auth process is now fully complete.
          // It's safe to render the rest of the application.
          setIsAuthReady(true);
        });
      
      // We only need to run this complex check once on the initial load.
      unsubscribe();
    });

    // Cleanup the listener if the component unmounts.
    return () => unsubscribe();
  }, []);

  // While we are waiting for Firebase to initialize and for the auth state
  // to be resolved, show a full-screen loading animation.
  if (!isAuthReady || !firebase) {
    return (
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      </BackgroundGradientAnimation>
    );
  }

  // Once auth is ready, provide the Firebase instances to the rest of the app.
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
