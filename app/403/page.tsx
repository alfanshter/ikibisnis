/**
 * Page: /403
 * Shown when the user's role does not have permission to access a feature.
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* Text */}
        <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-2">403 — Akses Ditolak</p>
        <h1 className="text-white text-2xl font-bold mb-3">Anda tidak punya izin</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Role Anda tidak memiliki akses ke halaman ini.
          Hubungi administrator untuk mengubah izin akses.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-slate-300 text-sm font-medium rounded-xl transition-all"
          >
            ← Kembali
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
