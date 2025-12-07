'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, type Query, type DocumentData, type QuerySnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// A memoization function to prevent re-renders from new query object references
const useMemoizedQuery = (query: Query | null) => {
  return useMemo(() => query, [query?.path, query?.where, query?.orderBy, query?.limit]);
}

export function useCollection<T>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedQuery = useMemoizedQuery(query);

  useEffect(() => {
    if (!memoizedQuery) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
        memoizedQuery, 
        (snapshot: QuerySnapshot<DocumentData>) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
            setData(docs);
            setLoading(false);
        },
        (err: Error) => {
            console.error(err);
            const permissionError = new FirestorePermissionError({
                path: (memoizedQuery as any)._path?.canonical,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading, error };
}
