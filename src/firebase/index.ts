import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import FirebaseProvider from './provider';
import FirebaseClientProvider from './client-provider';
import { useFirebase, useFirebaseApp, useFirestore, useAuth as useFirebaseAuth } from './provider';
import { useState, useEffect } from 'react';


let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  } else {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  return { app, auth, firestore };
}

// This hook now has a simpler responsibility: it just reports the current auth state.
// The complex initial loading is handled by the FirebaseClientProvider.
function useAuth() {
  const firebaseAuth = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  // This loading state is true until the onAuthStateChanged listener below fires for the first time.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseAuth) {
      // This listener will keep the user state up-to-date after the initial load.
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
        setLoading(false); // Once this fires, the auth state is known.
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    } else {
      // If firebaseAuth isn't available yet, we are in a loading state.
      setLoading(true);
    }
  }, [firebaseAuth]);

  return { user, loading, auth: firebaseAuth };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
