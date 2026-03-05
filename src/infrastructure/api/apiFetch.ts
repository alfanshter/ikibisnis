/**
 * Shared API fetch utility
 * Always injects Authorization: Bearer <token> from the stored session.
 * Handles the double-nested response wrapper from the backend.
 */

import { getToken } from '@/src/presentation/hooks/auth/useAuth';

/** Thrown when the backend returns 403 — permission denied */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const json = await res.json();

  // 403 — permission denied
  if (res.status === 403 || json.statusCode === 403) {
    throw new PermissionError(
      Array.isArray(json.message) ? json.message[0] : (json.message ?? 'Akses ditolak')
    );
  }

  if (!json.success) throw new Error(
    Array.isArray(json.message) ? json.message[0] : (json.message ?? 'API error')
  );

  // Unwrap double-nested response: { success, data: { success, data: <actual> } }
  const outer = json.data;
  if (outer !== null && typeof outer === 'object' && 'success' in outer && 'data' in outer) {
    if (!outer.success) throw new Error(
      Array.isArray(outer.message) ? outer.message[0] : (outer.message ?? 'API error')
    );
    return outer.data as T;
  }
  return outer as T;
}
