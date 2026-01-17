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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);

    const auth = getAuth(instances.app);

    // This is the key: onAuthStateChanged is the most reliable listener 
    // for when Firebase has determined the user's state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    // We also check for a redirect result to complete the sign-in flow.
    // onAuthStateChanged will then fire with the new user.
    getRedirectResult(auth).catch((error) => {
      // Handle potential errors from getRedirectResult, e.g., if the user
      // is on a different domain than where they started the sign-in.
      console.error("Error processing redirect result:", error);
    });

    return () => unsubscribe();
  }, []);
  
  const providerValue = useMemo(() => {
      if (!firebase) return null;
      return { ...firebase, user, loading, auth: firebase.auth };
  }, [firebase, user, loading]);

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
