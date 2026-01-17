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

function useAuth() {
  const firebaseAuth = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      console.log('[useAuth] Firebase Auth not available yet, setting loading to true.');
      setLoading(true);
      return;
    }
    
    console.log('[useAuth] Subscribing to onAuthStateChanged.');
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        console.log('[useAuth] onAuthStateChanged: user signed in:', user.uid);
      } else {
        console.log('[useAuth] onAuthStateChanged: user signed out.');
      }
      setUser(user);
      setLoading(false);
      console.log('[useAuth] onAuthStateChanged: finished, setting loading to false.');
    });

    return () => {
      console.log('[useAuth] Unsubscribing from onAuthStateChanged.');
      unsubscribe();
    }
  }, [firebaseAuth]);
  
  console.log(`[useAuth] Hook returning: { user: ${user?.uid || 'null'}, loading: ${loading} }`);
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
