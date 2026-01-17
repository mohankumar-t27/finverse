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
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setInstances(firebaseInstances);
    const auth = getAuth(firebaseInstances.app);

    // This listener is the single source of truth for the user's state.
    // It will be triggered by onAuthStateChanged itself, and also by
    // getRedirectResult when it successfully processes a sign-in.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Auth state is now confirmed, we can stop loading.
    });
    
    // Check for a redirect result. This should be called on every page load
    // to handle the redirect from the identity provider.
    // The result is handled by the onAuthStateChanged listener above.
    getRedirectResult(auth).catch((error) => {
      // Handle potential errors, e.g., user cancels the sign-in
      console.error("Firebase redirect check error:", error);
      // Even if it errors, onAuthStateChanged will still fire with a null user,
      // correctly setting loading to false.
    });


    return () => unsubscribe();
  }, []);

  const providerValue = useMemo(() => {
    if (!instances) return null;
    return { ...instances, user, loading };
  }, [instances, user, loading]);

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
      user={providerValue.user}
      loading={providerValue.loading}
    >
      {children}
    </FirebaseProvider>
  );
}
