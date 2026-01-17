'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from './index';
import FirebaseProvider from './provider';
import { type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getRedirectResult, type Auth, type User } from 'firebase/auth';
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
  const [user, setUser] = useState<User | null>(null);
  // This loading state will remain true until the initial auth state is confirmed.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);
    const auth = getAuth(instances.app);

    // onAuthStateChanged is the most reliable listener for the initial auth state.
    // It fires once on page load, either with a user or with null.
    // We set loading to false *only* inside this callback.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // We also call getRedirectResult() to process any pending sign-in.
    // A successful redirect will trigger the onAuthStateChanged listener above,
    // which will then update the user and loading state correctly.
    getRedirectResult(auth).catch((error) => {
      console.error("Error processing redirect result:", error);
      // If there's an error (e.g., user cancels), onAuthStateChanged will still
      // fire (with null), ensuring the loading state is correctly resolved.
    });

    return () => unsubscribe();
  }, []); // This effect runs only once.

  const providerValue = useMemo(() => {
      if (!firebase) return null;
      return { ...firebase, user, loading, auth: firebase.auth };
  }, [firebase, user, loading]);

  // The provider shows a loader until onAuthStateChanged has fired.
  if (loading || !providerValue) {
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
      app={providerValue.app}
      auth={providerValue.auth}
      firestore={providerValue.firestore}
      user={user}
      loading={loading}
    >
      {children}
    </FirebaseProvider>
  );
}
