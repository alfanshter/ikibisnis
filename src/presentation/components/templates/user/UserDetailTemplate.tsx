/**
 * Template: UserDetailTemplate
 * Full-page user detail view — mirrors ProjectDetailTemplate layout.
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ApiUser } from '@/src/domain/entities/User';
import { Sidebar } from '../../organisms/shared/Sidebar';
import { TopBar } from '../../organisms/shared/TopBar';
import { Icon } from '../../atoms/Icon';
import { UserAvatarComponent } from '../../molecules/user/UserAvatar';
import { RoleBadge } from '../../molecules/role/RoleBadge';
import { StatusBadge } from '../../molecules/user/StatusBadge';

/* ─── helpers ───────────────────────────────────────────────────────────── */
const formatDate = (iso?: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch { return '—'; }
};

const formatGender = (g?: string): string => {
  if (g === 'male')   return 'Laki-laki';
  if (g === 'female') return 'Perempuan';
  return '—';
};

/* ─── reusable card shell ───────────────────────────────────────────────── */
const Card: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700/40">
      <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
        <Icon name={icon as Parameters<typeof Icon>[0]['name']} className="w-3.5 h-3.5 text-blue-400" />
      </div>
      <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-widest">{title}</h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

/* ─── one info row inside a card ─────────────────────────────────────────── */
const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-700/30 last:border-0">
    <span className="text-slate-500 text-xs font-medium w-36 shrink-0">{label}</span>
    <span className="text-slate-200 text-sm text-right">{value ?? '—'}</span>
  </div>
);

/* ─── main component ─────────────────────────────────────────────────────── */
export interface UserDetailTemplateProps {
  user:   ApiUser;
  onEdit: () => void;
}

export const UserDetailTemplate: React.FC<UserDetailTemplateProps> = ({ user, onEdit }) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activePage="User Management" />

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="px-6 lg:px-10 pt-8 pb-12 max-w-4xl mx-auto">

          {/* ── Top Bar ── */}
          <TopBar
            title="Detail Pengguna"
            subtitle={user.email}
            action={
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700/60 transition-all"
                >
                  <Icon name="chevron-left" className="w-4 h-4" />
                  Kembali
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  <Icon name="edit" className="w-5 h-5" />
                  Edit Pengguna
                </button>
              </div>
            }
          />

          {/* ── Header card ── */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-center gap-5">
              <UserAvatarComponent fullName={user.fullName} size="lg" />
              <div className="min-w-0 flex-1">
                <h1 className="text-white text-2xl font-bold leading-tight mb-1">{user.fullName}</h1>
                <p className="text-slate-400 text-sm mb-3">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {user.roleName && <RoleBadge name={user.roleName} />}
                  <StatusBadge isActive={user.isActive} />
                </div>
              </div>
              {user.lastLoginAt && (
                <div className="text-right shrink-0">
                  <p className="text-slate-500 text-xs mb-0.5">Login Terakhir</p>
                  <p className="text-slate-300 text-sm font-medium">{formatDate(user.lastLoginAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Two column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Informasi Akun */}
            <Card title="Informasi Akun" icon="user">
              <Row label="Nama Lengkap" value={user.fullName} />
              <Row label="Email" value={user.email} />
              <Row label="Role" value={user.roleName ? <RoleBadge name={user.roleName} /> : '—'} />
              <Row label="Status" value={<StatusBadge isActive={user.isActive} />} />
              <Row label="Dibuat" value={formatDate(user.createdAt)} />
              <Row label="Diperbarui" value={formatDate(user.updatedAt)} />
            </Card>

            {/* Kontak & Alamat */}
            <Card title="Kontak & Alamat" icon="phone">
              <Row label="Nomor HP"   value={user.phone   || '—'} />
              <Row label="Alamat"     value={user.address || '—'} />
            </Card>

            {/* Data Pribadi */}
            <Card title="Data Pribadi" icon="user">
              <Row label="Jenis Kelamin" value={formatGender(user.gender)} />
              <Row label="Tempat Lahir"  value={user.birthPlace || '—'} />
              <Row label="Tanggal Lahir" value={user.birthDate ? formatDate(user.birthDate + 'T00:00:00') : '—'} />
            </Card>

            {/* Dokumen Legal */}
            <Card title="Dokumen Legal" icon="archive">
              <Row label="NIK / KTP" value={user.nik  || '—'} />
              <Row label="NPWP"      value={user.npwp || '—'} />
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};
