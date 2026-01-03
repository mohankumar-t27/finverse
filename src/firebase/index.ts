import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, getRedirectResult, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import FirebaseProvider from './provider';
import FirebaseClientProvider from './client-provider';
import { useFirebase, useFirebaseApp, useFirestore, useAuth as useFirebaseAuth } from './provider';
import { useState, useEffect, useRef } from 'react';


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

function useAuth() {
  const firebaseAuth = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isProcessingRedirect = useRef(false);

  useEffect(() => {
    if (!firebaseAuth || isProcessingRedirect.current) {
      return;
    }

    const processRedirect = async () => {
        try {
            // Avoid processing redirect more than once
            if (isProcessingRedirect.current) return;
            isProcessingRedirect.current = true;
            await getRedirectResult(firebaseAuth);
            // The onAuthStateChanged listener below will handle the user state update.
        } catch (error) {
            console.error('[useAuth] Error processing redirect result:', error);
        } finally {
            isProcessingRedirect.current = false;
        }
    };
    
    // Process redirect result first
    processRedirect();

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
        setLoading(false);
    });

    return () => unsubscribe();
    
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
