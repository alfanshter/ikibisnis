/**
 * Organism: SecuritySettingsForm
 * Change password form.
 */
'use client';
import React, { useState } from 'react';
import { ChangePasswordDTO } from '@/src/domain/entities/Settings';
import { SettingsSection } from '@/src/presentation/components/molecules/SettingsSection';
import { SettingsField } from '@/src/presentation/components/molecules/SettingsField';
import { Icon } from '@/src/presentation/components/atoms/Icon';

interface Props {
  saving:   boolean;
  onSave:   (dto: ChangePasswordDTO) => void;
  apiError: string | null;
}

export const SecuritySettingsForm: React.FC<Props> = ({ saving, onSave, apiError }) => {
  const [form, setForm] = useState<ChangePasswordDTO>({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordDTO>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const set = (key: keyof ChangePasswordDTO, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<ChangePasswordDTO> = {};
    if (!form.currentPassword) e.currentPassword = 'Wajib diisi';
    if (form.newPassword.length < 8) e.newPassword = 'Minimal 8 karakter';
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Tidak cocok dengan password baru';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className="space-y-5">
      <SettingsSection icon="lock" title="Ubah Password" description="Gunakan password yang kuat dan unik.">
        {apiError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
            {apiError}
          </div>
        )}
        <div className="space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password Saat Ini *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={e => set('currentPassword', e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-900 border rounded-lg px-3 py-2 pr-10 text-white text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.currentPassword ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
              />
              <button type="button" onClick={() => setShowCurrent(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <Icon name={showCurrent ? 'eye-off' : 'eye'} className="w-4 h-4" />
              </button>
            </div>
            {errors.currentPassword && <p className="text-xs text-red-400 mt-1">{errors.currentPassword}</p>}
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password Baru *
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={form.newPassword}
                onChange={e => set('newPassword', e.target.value)}
                placeholder="Minimal 8 karakter"
                className={`w-full bg-slate-900 border rounded-lg px-3 py-2 pr-10 text-white text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.newPassword ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
              />
              <button type="button" onClick={() => setShowNew(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <Icon name={showNew ? 'eye-off' : 'eye'} className="w-4 h-4" />
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>}
            {/* Strength bar */}
            {form.newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1,2,3,4].map(n => (
                    <div key={n} className={`h-1 flex-1 rounded-full ${
                      form.newPassword.length >= n * 3
                        ? n <= 2 ? 'bg-red-500' : n === 3 ? 'bg-amber-500' : 'bg-emerald-500'
                        : 'bg-slate-700'
                    }`} />
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  {form.newPassword.length < 6 ? 'Lemah' : form.newPassword.length < 10 ? 'Cukup' : form.newPassword.length < 12 ? 'Kuat' : 'Sangat Kuat'}
                </p>
              </div>
            )}
          </div>

          {/* Confirm */}
          <SettingsField label="Konfirmasi Password Baru *" type="password"
            value={form.confirmPassword} onChange={v => set('confirmPassword', v as string)}
            placeholder="Ulangi password baru" error={errors.confirmPassword} />
        </div>
      </SettingsSection>

      {/* Security tips */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3">
          <Icon name="shield" className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">Tips Keamanan</p>
            <ul className="text-slate-400 text-xs space-y-0.5 list-disc list-inside">
              <li>Gunakan kombinasi huruf, angka, dan simbol</li>
              <li>Hindari penggunaan informasi pribadi</li>
              <li>Jangan gunakan password yang sama di situs lain</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan…</>
            : <><Icon name="lock" className="w-4 h-4" />Ubah Password</>}
        </button>
      </div>
    </div>
  );
};
