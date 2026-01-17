'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { type FirebaseApp } from 'firebase/app';
import { type Auth, type User } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
    app: null,
    auth: null,
    firestore: null,
    user: null,
    loading: true,
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirestore() {
  const context = useFirebase();
  return context?.firestore;
}

export function useFirebaseApp() {
    const context = useFirebase();
    return context?.app;
}

export function useAuth() {
    return useContext(FirebaseContext);
}

interface FirebaseProviderProps {
    children: React.ReactNode;
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    user: User | null;
    loading: boolean;
}

export default function FirebaseProvider({ children, app, auth, firestore, user, loading }: FirebaseProviderProps) {
  const memoizedValue = useMemo(() => {
    return { app, auth, firestore, user, loading };
  }, [app, auth, firestore, user, loading]);

  return (
    <FirebaseContext.Provider value={memoizedValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
