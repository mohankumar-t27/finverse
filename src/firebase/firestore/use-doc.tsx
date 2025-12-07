'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, type DocumentReference, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// A memoization function to prevent re-renders from new doc ref object references
const useMemoizedDocRef = (docRef: DocumentReference | null) => {
    return useMemo(() => docRef, [docRef?.path]);
}

export function useDoc<T>(ref: DocumentReference | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedRef = useMemoizedDocRef(ref);

  useEffect(() => {
    if (!memoizedRef) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
        memoizedRef, 
        (snapshot: DocumentSnapshot<DocumentData>) => {
            if (snapshot.exists()) {
                setData({ id: snapshot.id, ...snapshot.data() } as unknown as T);
            } else {
                setData(null);
            }
            setLoading(false);
        },
        (err: Error) => {
            console.error(err);
            const permissionError = new FirestorePermissionError({
                path: memoizedRef.path,
                operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, loading, error };
}
