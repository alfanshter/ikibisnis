/**
 * Hook: useUserDetail
 * Fetches a single user by ID from GET /api/v1/users/:id.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiUser } from '@/src/domain/entities/User';
import { apiFetch } from '@/src/infrastructure/api/apiFetch';

const BASE = `/api/proxy/v1/users`;

export const useUserDetail = (id: string) => {
  const [user,     setUser]     = useState<ApiUser | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const data = await apiFetch<ApiUser>(`${BASE}/${id}`);
      setUser(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { user, loading, notFound };
};
