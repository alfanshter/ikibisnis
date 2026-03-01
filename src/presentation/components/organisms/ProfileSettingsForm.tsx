/**
 * Organism: ProfileSettingsForm
 * Edit user name, email, role, phone, bio.
 */
'use client';
import React, { useState } from 'react';
import { UserProfile } from '@/src/domain/entities/Settings';
import { SettingsSection } from '@/src/presentation/components/molecules/SettingsSection';
import { SettingsField } from '@/src/presentation/components/molecules/SettingsField';
import { Icon } from '@/src/presentation/components/atoms/Icon';

interface Props {
  initial: UserProfile;
  saving:  boolean;
  onSave:  (p: UserProfile) => void;
}

export const ProfileSettingsForm: React.FC<Props> = ({ initial, saving, onSave }) => {
  const [form,   setForm]   = useState<UserProfile>({ ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const set = <K extends keyof UserProfile>(key: K, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof UserProfile, string>> = {};
    if (!form.name.trim())  e.name  = 'Nama wajib diisi';
    if (!form.email.trim()) e.email = 'Email wajib diisi';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, avatarInitial: (form.name[0] ?? 'A').toUpperCase() });
  };

  return (
    <div className="space-y-5">
      <SettingsSection icon="user" title="Profil Pengguna" description="Informasi akun administrator.">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow">
            {(form.name[0] ?? 'A').toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold">{form.name || '—'}</p>
            <p className="text-slate-400 text-sm">{form.role}</p>
            <p className="text-slate-500 text-xs">{form.email || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Nama Lengkap *" value={form.name} onChange={v => set('name', v as string)}
            placeholder="Nama lengkap" error={errors.name} />
          <SettingsField label="Email *" type="email" value={form.email} onChange={v => set('email', v as string)}
            placeholder="admin@toko.id" error={errors.email} />
          <SettingsField label="Telepon" type="tel" value={form.phone} onChange={v => set('phone', v as string)}
            placeholder="+62 812-xxxx-xxxx" />
          <SettingsField label="Role" type="select" value={form.role} onChange={v => set('role', v as string)}
            options={[{ value: 'Super Admin', label: 'Super Admin' }, { value: 'Admin', label: 'Admin' }, { value: 'Kasir', label: 'Kasir' }]} />
        </div>
        <SettingsField label="Bio" type="textarea" rows={2} value={form.bio} onChange={v => set('bio', v as string)}
          placeholder="Ceritakan sedikit tentang Anda…" />
      </SettingsSection>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan…</>
            : <><Icon name="save" className="w-4 h-4" />Simpan Profil</>}
        </button>
      </div>
    </div>
  );
};
