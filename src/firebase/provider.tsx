'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { type FirebaseApp } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

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
    const context = useFirebase();
    return context?.auth;
}

interface FirebaseProviderProps {
    children: React.ReactNode;
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
}

export default function FirebaseProvider({ children, app, auth, firestore }: FirebaseProviderProps) {
  const memoizedValue = useMemo(() => {
    return { app, auth, firestore };
  }, [app, auth, firestore]);

  return (
    <FirebaseContext.Provider value={memoizedValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
