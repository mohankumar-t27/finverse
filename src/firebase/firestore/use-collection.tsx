'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, type Query, type DocumentData, type QuerySnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(query: Query | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedQuery = useMemo(() => {
    if (!query) return null;
    // This string representation is a simplified way to capture the essence of the query for dependency tracking.
    // Firestore Query objects are complex, so comparing them directly is not reliable for useEffect.
    const queryParts = [
      (query as any)._query.path.segments.join('/'),
      ...(query as any)._query.filters.map((f: any) => `${f.field.segments.join('.')}${f.op}${f.value}`),
      ...(query as any)._query.explicitOrderBy.map((o: any) => `${o.field.segments.join('.')}${o.dir}`),
    ];
    return { query, key: queryParts.join('|') };
  }, [query]);

  useEffect(() => {
    if (!memoizedQuery) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
        memoizedQuery.query, 
        (snapshot: QuerySnapshot<DocumentData>) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
            setData(docs);
            setLoading(false);
        },
        (err: Error) => {
            console.error(err);
            const permissionError = new FirestorePermissionError({
                path: (memoizedQuery.query as any)._path?.canonical,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedQuery?.key]);

  return { data, loading, error };
}
