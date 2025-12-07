// NOTE: This file is just a placeholder to resolve the module not found error.
'use client';
import { useState } from 'react';

export function useDoc<T>(ref: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  return { data, loading, error };
}
