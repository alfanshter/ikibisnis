/**
 * Organism: StoreSettingsForm
 * Edit store name, contact info, currency, logo.
 */
'use client';
import React, { useState } from 'react';
import { AppSettings } from '@/src/domain/entities/Settings';
import { SettingsSection } from '@/src/presentation/components/molecules/settings/SettingsSection';
import { SettingsField } from '@/src/presentation/components/molecules/settings/SettingsField';
import { Icon } from '@/src/presentation/components/atoms/Icon';

const LOGO_COLORS = [
  { value: 'blue',    label: 'Biru'    },
  { value: 'purple',  label: 'Ungu'    },
  { value: 'emerald', label: 'Hijau'   },
  { value: 'rose',    label: 'Merah'   },
  { value: 'amber',   label: 'Kuning'  },
];

const COLOR_MAP: Record<string, string> = {
  blue:    'bg-blue-500',
  purple:  'bg-purple-500',
  emerald: 'bg-emerald-500',
  rose:    'bg-rose-500',
  amber:   'bg-amber-500',
};

interface Props {
  initial: AppSettings;
  saving:  boolean;
  onSave:  (s: AppSettings) => void;
}

export const StoreSettingsForm: React.FC<Props> = ({ initial, saving, onSave }) => {
  const [form, setForm] = useState<AppSettings>({ ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof AppSettings, string>>>({});

  const set = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof AppSettings, string>> = {};
    if (!form.storeName.trim()) e.storeName = 'Nama toko wajib diisi';
    if (!form.storeEmail.trim()) e.storeEmail = 'Email wajib diisi';
    if (!form.logoInitial.trim()) e.logoInitial = 'Inisial logo wajib diisi';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className="space-y-5">
      {/* Identity */}
      <SettingsSection icon="store" title="Identitas Toko" description="Nama dan tagline yang tampil di sidebar.">
        {/* Logo preview */}
        <div className="flex items-center gap-4 mb-2">
          <div className={`w-14 h-14 ${COLOR_MAP[form.logoColor] ?? 'bg-blue-500'} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
            {form.logoInitial || '?'}
          </div>
          <div>
            <p className="text-white font-semibold text-base">{form.storeName || '—'}</p>
            <p className="text-slate-400 text-xs tracking-widest">{form.storeTagline || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Nama Toko *" value={form.storeName} onChange={v => set('storeName', v as string)}
            placeholder="Nexus Admin" error={errors.storeName} />
          <SettingsField label="Tagline" value={form.storeTagline} onChange={v => set('storeTagline', v as string)}
            placeholder="MANAGEMENT SYSTEM" />
          <SettingsField label="Inisial Logo *" value={form.logoInitial} onChange={v => set('logoInitial', (v as string).slice(0, 2).toUpperCase())}
            placeholder="N" error={errors.logoInitial}
            hint="1–2 huruf kapital" />
          <SettingsField label="Warna Logo" type="select" value={form.logoColor}
            onChange={v => set('logoColor', v as string)} options={LOGO_COLORS} />
        </div>
      </SettingsSection>

      {/* Contact */}
      <SettingsSection icon="phone" title="Informasi Kontak" description="Alamat dan kontak yang ditampilkan di laporan.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Nomor Telepon" type="tel" value={form.storePhone}
            onChange={v => set('storePhone', v as string)} placeholder="+62 812-xxxx-xxxx" />
          <SettingsField label="Email" type="email" value={form.storeEmail}
            onChange={v => set('storeEmail', v as string)} placeholder="admin@toko.id" error={errors.storeEmail} />
          <SettingsField label="Website" type="url" value={form.storeWebsite}
            onChange={v => set('storeWebsite', v as string)} placeholder="https://toko.id" />
          <SettingsField label="Timezone" type="select" value={form.timezone}
            onChange={v => set('timezone', v as string)}
            options={[{ value: 'Asia/Jakarta', label: 'WIB (Asia/Jakarta)' }, { value: 'Asia/Makassar', label: 'WITA (Asia/Makassar)' }, { value: 'Asia/Jayapura', label: 'WIT (Asia/Jayapura)' }]} />
        </div>
        <SettingsField label="Alamat" type="textarea" rows={2} value={form.storeAddress}
          onChange={v => set('storeAddress', v as string)} placeholder="Jl. Contoh No. 1, Kota" />
      </SettingsSection>

      {/* Regional */}
      <SettingsSection icon="globe" title="Pengaturan Regional" description="Mata uang dan format angka.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Mata Uang" type="select" value={form.currency}
            onChange={v => set('currency', v as string)}
            options={[{ value: 'IDR', label: 'IDR — Rupiah' }, { value: 'USD', label: 'USD — Dollar' }, { value: 'SGD', label: 'SGD — Singapore Dollar' }]} />
        </div>
      </SettingsSection>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan…</>
            : <><Icon name="save" className="w-4 h-4" />Simpan Perubahan</>}
        </button>
      </div>
    </div>
  );
};
