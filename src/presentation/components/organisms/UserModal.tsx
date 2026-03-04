/**
 * Organism Component: UserModal
 * Modal dialog for creating or editing a user — with extended profile fields.
 */

'use client';

import React, { useState } from 'react';
import {
  User, UserRole, UserStatus, JenisKelamin,
  CreateUserDTO, UpdateUserDTO,
} from '@/src/domain/entities/User';
import { Icon } from '../atoms/Icon';

interface UserModalProps {
  mode:     'add' | 'edit';
  user?:    User;
  onClose:  () => void;
  onSubmit: (data: CreateUserDTO | UpdateUserDTO) => Promise<void>;
  saving?:  boolean;
}

const ROLES: UserRole[]         = ['Admin', 'Manager', 'Staff'];
const STATUSES: UserStatus[]    = ['Active', 'Inactive'];
const GENDERS: JenisKelamin[]   = ['Laki-laki', 'Perempuan'];

/* ─── Reusable field components ────────────────────────── */
const Label: React.FC<{ children: React.ReactNode; optional?: boolean }> = ({ children, optional }) => (
  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
    {children}
    {optional && <span className="ml-1 text-slate-600 normal-case tracking-normal font-normal">(opsional)</span>}
  </label>
);

const inputCls = (err?: string) =>
  `w-full bg-slate-900/50 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors ${err ? 'border-red-500/60' : 'border-slate-700/50'}`;

const selectCls = 'w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors appearance-none cursor-pointer';

/* ─── Main component ────────────────────────────────────── */
export const UserModal: React.FC<UserModalProps> = ({
  mode, user, onClose, onSubmit, saving = false,
}) => {
  // Identity
  const [name,          setName]         = useState(user?.name          ?? '');
  const [email,         setEmail]        = useState(user?.email         ?? '');
  const [role,          setRole]         = useState<UserRole>(user?.role ?? 'Staff');
  const [status,        setStatus]       = useState<UserStatus>(user?.status ?? 'Active');
  const [password,      setPassword]     = useState('');
  // Contact
  const [phone,         setPhone]        = useState(user?.phone         ?? '');
  const [address,       setAddress]      = useState(user?.address       ?? '');
  // Personal
  const [jenisKelamin,  setJenisKelamin] = useState<JenisKelamin | ''>(user?.jenis_kelamin ?? '');
  const [tanggalLahir,  setTanggalLahir] = useState(user?.tanggal_lahir ?? '');
  const [tempatLahir,   setTempatLahir]  = useState(user?.tempat_lahir  ?? '');
  // Legal (optional)
  const [noKtp,         setNoKtp]        = useState(user?.no_ktp        ?? '');
  const [npwp,          setNpwp]         = useState(user?.npwp          ?? '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim())  errs.name  = 'Nama wajib diisi';
    if (!email.trim()) errs.email = 'Email wajib diisi';
    else if (!email.includes('@')) errs.email = 'Format email tidak valid';
    if (mode === 'add' && !password) errs.password = 'Password wajib diisi';
    if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) errs.phone = 'Format nomor tidak valid';
    if (noKtp && noKtp.length !== 16) errs.no_ktp = 'NIK harus 16 digit';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const common = {
      name, email, role,
      phone:         phone       || undefined,
      address:       address     || undefined,
      jenis_kelamin: (jenisKelamin || undefined) as JenisKelamin | undefined,
      tanggal_lahir: tanggalLahir || undefined,
      tempat_lahir:  tempatLahir  || undefined,
      no_ktp:        noKtp        || undefined,
      npwp:          npwp         || undefined,
    };
    if (mode === 'add') {
      await onSubmit({ ...common, password } as CreateUserDTO);
    } else {
      await onSubmit({ id: user!.id, ...common, status } as UpdateUserDTO);
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

        {/* ── Scrollable form body ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

            {/* ── Section: Akun ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="user" className="w-3.5 h-3.5" /> Informasi Akun
              </p>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label>Nama Lengkap</Label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="contoh: Budi Santoso" className={inputCls(errors.name)} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="email@perusahaan.com" className={inputCls(errors.email)} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Role + Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <select value={role} onChange={e => setRole(e.target.value as UserRole)} className={selectCls}>
                      {ROLES.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                    </select>
                  </div>
                  {mode === 'edit' && (
                    <div>
                      <Label>Status</Label>
                      <select value={status} onChange={e => setStatus(e.target.value as UserStatus)} className={selectCls}>
                        {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Password (add only) */}
                {mode === 'add' && (
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" className={inputCls(errors.password) + ' pr-10'} />
                      <Icon name="lock" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-slate-700/30" />

            {/* ── Section: Kontak ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="phone" className="w-3.5 h-3.5" /> Kontak & Alamat
              </p>
              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <Label>Nomor HP</Label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="contoh: 081234567890" className={inputCls(errors.phone)} />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                {/* Address */}
                <div>
                  <Label>Alamat</Label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                    placeholder="Jl. Contoh No. 1, Kota" className={inputCls() + ' resize-none'} />
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-slate-700/30" />

            {/* ── Section: Data Pribadi ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="user" className="w-3.5 h-3.5" /> Data Pribadi
              </p>
              <div className="space-y-4">
                {/* Jenis Kelamin */}
                <div>
                  <Label>Jenis Kelamin</Label>
                  <select value={jenisKelamin} onChange={e => setJenisKelamin(e.target.value as JenisKelamin | '')} className={selectCls}>
                    <option value="" className="bg-slate-900">-- Pilih --</option>
                    {GENDERS.map(g => <option key={g} value={g} className="bg-slate-900">{g}</option>)}
                  </select>
                </div>

                {/* Tempat + Tanggal Lahir */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tempat Lahir</Label>
                    <input type="text" value={tempatLahir} onChange={e => setTempatLahir(e.target.value)}
                      placeholder="contoh: Jakarta" className={inputCls()} />
                  </div>
                  <div>
                    <Label>Tanggal Lahir</Label>
                    <input type="date" value={tanggalLahir} onChange={e => setTanggalLahir(e.target.value)}
                      className={inputCls() + ' scheme-dark'} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-slate-700/30" />

            {/* ── Section: Dokumen Legal (opsional) ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Icon name="archive" className="w-3.5 h-3.5" /> Dokumen Legal
                <span className="text-slate-600 normal-case font-normal tracking-normal">(opsional)</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* NIK / No KTP */}
                <div>
                  <Label optional>NIK / No. KTP</Label>
                  <input type="text" value={noKtp} onChange={e => setNoKtp(e.target.value)}
                    placeholder="16 digit NIK" maxLength={16} className={inputCls(errors.no_ktp)} />
                  {errors.no_ktp && <p className="text-red-400 text-xs mt-1">{errors.no_ktp}</p>}
                </div>
                {/* NPWP */}
                <div>
                  <Label optional>NPWP</Label>
                  <input type="text" value={npwp} onChange={e => setNpwp(e.target.value)}
                    placeholder="XX.XXX.XXX.X-XXX.XXX" className={inputCls()} />
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
