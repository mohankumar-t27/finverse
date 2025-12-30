'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, type DocumentReference, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export function useDoc<T>(ref: DocumentReference | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedRef = useMemo(() => {
    if (!ref) return null;
    return { ref, key: ref.path };
  }, [ref]);


  useEffect(() => {
    if (!memoizedRef) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
        memoizedRef.ref, 
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
                path: memoizedRef.ref.path,
                operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedRef?.key]);

  return { data, loading, error };
}
