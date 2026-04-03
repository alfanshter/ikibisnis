/**
 * Organism Component: UserModal
 * Create or edit a user — fields match POST/PUT /api/v1/users exactly.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  ApiUser, Gender,
  CreateUserApiDTO, UpdateUserApiDTO,
} from '@/src/domain/entities/User';
import { apiFetch } from '@/src/infrastructure/api/apiFetch';
import { Icon } from '../../atoms/Icon';

// ── Role option fetched from roles API ────────────────────────────────────
interface RoleOption { id: string; name: string; badgeColor: string }

interface UserModalProps {
  mode:     'add' | 'edit';
  user?:    ApiUser;
  onClose:  () => void;
  onSubmit: (data: CreateUserApiDTO | UpdateUserApiDTO) => Promise<void>;
  saving?:  boolean;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male',   label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

/* ─── Password strength rule ─────────────────────────────────────────────── */
const validatePasswordStrength = (pw: string): string | null => {
  if (!pw)              return 'Password wajib diisi';
  if (pw.length < 8)   return 'Password minimal 8 karakter';
  if (!/[A-Z]/.test(pw)) return 'Password harus mengandung huruf kapital (A-Z)';
  if (!/[a-z]/.test(pw)) return 'Password harus mengandung huruf kecil (a-z)';
  if (!/[0-9]/.test(pw)) return 'Password harus mengandung angka (0-9)';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password harus mengandung karakter spesial (!@#$%^&* dll)';
  return null;
};

/* ─── Reusable field components ──────────────────────────────────────────── */
const Label: React.FC<{ children: React.ReactNode; optional?: boolean }> = ({ children, optional }) => (
  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
    {children}
    {optional && <span className="ml-1 text-slate-600 normal-case tracking-normal font-normal">(opsional)</span>}
  </label>
);

const inputCls = (err?: string) =>
  `w-full bg-slate-900/50 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors ${err ? 'border-red-500/60' : 'border-slate-700/50'}`;

const selectCls = 'w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors appearance-none cursor-pointer';

/* ─── Main component ─────────────────────────────────────────────────────── */
export const UserModal: React.FC<UserModalProps> = ({
  mode, user, onClose, onSubmit, saving = false,
}) => {
  // Identity
  const [fullName,  setFullName]  = useState(user?.fullName  ?? '');
  const [email,     setEmail]     = useState(user?.email     ?? '');
  const [roleId,    setRoleId]    = useState(user?.roleId ?? '');
  const [password,  setPassword]  = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Contact
  const [phone,     setPhone]     = useState(user?.phone    ?? '');
  const [address,   setAddress]   = useState(user?.address  ?? '');
  // Personal
  const [gender,       setGender]      = useState<Gender | ''>(user?.gender      ?? '');
  const [birthDate,    setBirthDate]   = useState(user?.birthDate   ?? '');
  const [birthPlace,   setBirthPlace]  = useState(user?.birthPlace  ?? '');
  // Legal
  const [nik,  setNik]  = useState(user?.nik  ?? '');
  const [npwp, setNpwp] = useState(user?.npwp ?? '');

  // Roles list from API
  const [roles,       setRoles]       = useState<RoleOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ data: RoleOption[]; total: number }>(`${BACKEND}/api/v1/roles?limit=100`)
      .then(result => {
        if (cancelled) return;
        const list: RoleOption[] = (result?.data ?? []).map(r => ({
          id: r.id, name: r.name, badgeColor: r.badgeColor,
        }));
        setRoles(list);
        if (!roleId && list.length > 0) setRoleId(list[0].id);
      })
      .catch(() => {/* silent */})
      .finally(() => { if (!cancelled) setRolesLoading(false); });
    return () => { cancelled = true; };
  }, [BACKEND, roleId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama wajib diisi';
    if (!email.trim())    errs.email    = 'Email wajib diisi';
    else if (!email.includes('@')) errs.email = 'Format email tidak valid';
    if (!roleId)          errs.roleId   = 'Role wajib dipilih';
    if (mode === 'add') {
      const pwErr = validatePasswordStrength(password);
      if (pwErr) errs.password = pwErr;
      if (!confirmPassword) errs.confirmPassword = 'Konfirmasi password wajib diisi';
      else if (password !== confirmPassword) errs.confirmPassword = 'Password tidak cocok';
      if (!phone.trim())   errs.phone   = 'Nomor HP wajib diisi';
      if (!address.trim()) errs.address = 'Alamat wajib diisi';
      if (!gender)         errs.gender  = 'Jenis kelamin wajib dipilih';
    }
    if (nik  && nik.length  !== 16) errs.nik  = 'NIK harus 16 digit';
    if (npwp && npwp.length !== 15) errs.npwp = 'NPWP harus 15 digit';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === 'add') {
      await onSubmit({
        fullName, email, roleId,
        password, confirmPassword,
        phone, address,
        gender: gender as Gender,
        birthPlace:  birthPlace  || undefined,
        birthDate:   birthDate   || undefined,
        nik:         nik         || undefined,
        npwp:        npwp        || undefined,
      } as CreateUserApiDTO);
    } else {
      await onSubmit({
        fullName:    fullName    || undefined,
        phone:       phone       || undefined,
        address:     address     || undefined,
        gender:      (gender as Gender) || undefined,
        birthPlace:  birthPlace  || undefined,
        birthDate:   birthDate   || undefined,
        nik:         nik         || undefined,
        npwp:        npwp        || undefined,
        roleId:      roleId      || undefined,
      } as UpdateUserApiDTO);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icon name={mode === 'add' ? 'plus' : 'edit'} className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {mode === 'add' ? 'Tambah Pengguna' : 'Edit Pengguna'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

            {/* ── Akun ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="user" className="w-3.5 h-3.5" /> Informasi Akun
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Nama Lengkap</Label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="contoh: Budi Santoso" className={inputCls(errors.fullName)} />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {mode === 'add' && (
                  <div>
                    <Label>Email</Label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@perusahaan.com" className={inputCls(errors.email)} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                )}

                <div>
                  <Label>Role</Label>
                  {rolesLoading ? (
                    <div className="h-10 bg-slate-700/50 rounded-lg animate-pulse" />
                  ) : (
                    <select value={roleId} onChange={e => setRoleId(e.target.value)} className={selectCls}>
                      <option value="" className="bg-slate-900">-- Pilih Role --</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id} className="bg-slate-900">{r.name}</option>
                      ))}
                    </select>
                  )}
                  {errors.roleId && <p className="text-red-400 text-xs mt-1">{errors.roleId}</p>}
                </div>

                {mode === 'add' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Password</Label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="min. 8 karakter" className={inputCls(errors.password)} />
                      {errors.password
                        ? <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                        : <p className="text-slate-600 text-xs mt-1">Huruf besar, kecil, angka & simbol</p>
                      }
                    </div>
                    <div>
                      <Label>Konfirmasi Password</Label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="ulangi password" className={inputCls(errors.confirmPassword)} />
                      {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-700/30" />

            {/* ── Kontak ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="phone" className="w-3.5 h-3.5" /> Kontak & Alamat
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Nomor HP</Label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="contoh: 081234567890" className={inputCls(errors.phone)} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label>Alamat</Label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                    placeholder="Jl. Contoh No. 1, Kota" className={inputCls(errors.address) + ' resize-none'} />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700/30" />

            {/* ── Data Pribadi ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="user" className="w-3.5 h-3.5" /> Data Pribadi
              </p>
              <div className="space-y-4">
                <div>
                  <Label>Jenis Kelamin</Label>
                  <select value={gender} onChange={e => setGender(e.target.value as Gender | '')} className={selectCls}>
                    <option value="" className="bg-slate-900">-- Pilih --</option>
                    {GENDERS.map(g => <option key={g.value} value={g.value} className="bg-slate-900">{g.label}</option>)}
                  </select>
                  {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label optional>Tempat Lahir</Label>
                    <input type="text" value={birthPlace} onChange={e => setBirthPlace(e.target.value)}
                      placeholder="contoh: Bandung" className={inputCls()} />
                  </div>
                  <div>
                    <Label optional>Tanggal Lahir</Label>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                      className={inputCls()} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700/30" />

            {/* ── Dokumen Legal ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="archive" className="w-3.5 h-3.5" /> Dokumen Legal
                <span className="text-slate-600 normal-case font-normal tracking-normal">(opsional)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label optional>NIK / No. KTP</Label>
                  <input type="text" value={nik} onChange={e => setNik(e.target.value)}
                    placeholder="16 digit NIK" maxLength={16} className={inputCls(errors.nik)} />
                  {errors.nik && <p className="text-red-400 text-xs mt-1">{errors.nik}</p>}
                </div>
                <div>
                  <Label optional>NPWP</Label>
                  <input type="text" value={npwp} onChange={e => setNpwp(e.target.value)}
                    placeholder="15 digit NPWP" maxLength={15} className={inputCls(errors.npwp)} />
                  {errors.npwp && <p className="text-red-400 text-xs mt-1">{errors.npwp}</p>}
                </div>
              </div>
            </div>

          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 px-6 py-4 border-t border-slate-700/50 shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {mode === 'add' ? 'Buat Pengguna' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── ChangePasswordModal ───────────────────────────────────────────────────────

interface ChangePasswordModalProps {
  user:     ApiUser;
  onClose:  () => void;
  onSubmit: (dto: ChangePasswordDTO) => Promise<void>;
  saving?:  boolean;
}

import { ChangePasswordDTO } from '@/src/domain/entities/User';

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  user, onClose, onSubmit, saving = false,
}) => {
  const [currentPassword,  setCurrentPassword]  = useState('');
  const [newPassword,      setNewPassword]      = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const pwErr = validatePasswordStrength(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (!confirmPassword)       errs.confirmPassword = 'Konfirmasi password wajib diisi';
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Password tidak cocok';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      currentPassword: currentPassword || undefined,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Icon name="lock" className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Ganti Password</h2>
              <p className="text-slate-400 text-xs">{user.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <Label optional>Password Saat Ini</Label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••" className={inputCls()} />
          </div>
          <div>
            <Label>Password Baru</Label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="min. 8 karakter" className={inputCls(errors.newPassword)} />
            {errors.newPassword
              ? <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>
              : <p className="text-slate-600 text-xs mt-1">Huruf besar, kecil, angka & simbol</p>
            }
          </div>
          <div>
            <Label>Konfirmasi Password Baru</Label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="ulangi password baru" className={inputCls(errors.confirmPassword)} />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
