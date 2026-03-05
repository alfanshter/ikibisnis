/**
 * Hook: useAuth
 * Handles login, logout, and reading the stored session.
 */

'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id:          string;
  fullName:    string;
  email:       string;
  roleId:      string;
  roleName:    string;
  gender:      string;
  isActive:    boolean;
  lastLoginAt: string | null;
}

export interface AuthSession {
  accessToken: string;
  expiresIn:   number;
  expiresAt:   number;   // epoch ms — computed on save
  user:        AuthUser;
}

// ── Storage key ───────────────────────────────────────────────────────────────
const SESSION_KEY = 'nexus_session';

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    // Auto-invalidate if expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => getSession()?.accessToken ?? null;

const saveSession = (session: AuthSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const router = useRouter();

  const login = useCallback(async (
    email: string,
    password: string,
  ): Promise<{ success: true } | { success: false; message: string }> => {
    const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

    try {
      const res = await fetch(`${BACKEND}/api/v1/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });

      const json = await res.json();

      // Unwrap double-nested response (same pattern as other API calls)
      const outerData = json?.data;
      const innerData = (outerData && typeof outerData === 'object' && 'data' in outerData)
        ? outerData.data
        : outerData;

      if (!json.success) {
        const msg = Array.isArray(json.message)
          ? json.message[0]
          : (json.message ?? 'Login gagal');
        return { success: false, message: msg };
      }

      // innerData = { accessToken, expiresIn, user }
      const { accessToken, expiresIn, user } = innerData as {
        accessToken: string;
        expiresIn:   number;
        user:        AuthUser;
      };

      saveSession({
        accessToken,
        expiresIn,
        expiresAt: Date.now() + expiresIn * 1000,
        user,
      });

      return { success: true };
    } catch {
      return { success: false, message: 'Tidak dapat terhubung ke server. Coba lagi.' };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.push('/login');
  }, [router]);

  return { login, logout, getSession, getToken };
};
