'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { initializeFirebase } from './index';

const FirebaseContext = createContext<any>(null);

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirestore() {
  const { firestore } = useFirebase() || {};
  return firestore;
}

export function useFirebaseApp() {
    const { app } = useFirebase() || {};
    return app;
}

export function useAuth() {
    const { auth } = useFirebase() || {};
    return auth;
}

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [firebase, setFirebase] = useState<any>(null);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  const memoizedValue = useMemo(() => firebase, [firebase]);

  if (!memoizedValue) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Initializing Firebase...</p>
        </div>
    );
  }

  return (
    <FirebaseContext.Provider value={memoizedValue}>
      {children}
    </FirebaseContext.Provider>
  );
}
