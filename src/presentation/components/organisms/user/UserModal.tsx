/**
 * Organism Component: UserModal
 * Create or edit a user — fields match POST/PUT /api/v1/users exactly.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

/* ─── ModalSelect (custom styled dropdown for use inside modals) ─────────── */
interface MSelectOption { value: string; label: string }
interface ModalSelectProps {
  value: string;
  options: MSelectOption[];
  onChange: (v: string) => void;
  error?: boolean;
}
const ModalSelect: React.FC<ModalSelectProps> = ({ value, options, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const selected = options.find(o => o.value === value);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen(p => !p);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border rounded-lg text-sm transition-colors ${
          open
            ? 'border-blue-500/60'
            : error
              ? 'border-red-500/60'
              : 'border-slate-700/50 hover:border-slate-600/70'
        } ${value ? 'text-white' : 'text-slate-500'}`}
      >
        <span>{selected?.label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} className="w-4 h-4 text-slate-500 shrink-0" />
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
          className="bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl py-1 overflow-hidden"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center px-4 py-2.5 text-sm transition-all ${
                value === opt.value
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

/* ─── ModalDatePicker (fully custom dark calendar) ───────────────────────── */
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAYS_ID   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

const ModalDatePicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open,    setOpen]    = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const today   = new Date();
  const parsed  = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear,  setViewYear]  = useState(parsed?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? today.getMonth());
  const [showYearPicker, setShowYearPicker] = useState(false);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 280) });
    }
    setOpen(p => !p);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowYearPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid (always 6 rows × 7 cols)
  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
    setShowYearPicker(false);
  };

  const isSelected = (day: number) =>
    parsed &&
    parsed.getFullYear() === viewYear &&
    parsed.getMonth()    === viewMonth &&
    parsed.getDate()     === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth()    === viewMonth &&
    today.getDate()     === day;

  const displayValue = () => {
    if (!parsed) return null;
    return `${parsed.getDate()} ${MONTHS_ID[parsed.getMonth()].slice(0,3)} ${parsed.getFullYear()}`;
  };

  // Year picker: show ±8 years around viewYear
  const yearRange = Array.from({ length: 17 }, (_, i) => viewYear - 8 + i);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border rounded-lg text-sm transition-colors ${
          open ? 'border-blue-500/60' : 'border-slate-700/50 hover:border-slate-600/70'
        } ${value ? 'text-white' : 'text-slate-500'}`}
      >
        <span>{displayValue() ?? 'Pilih tanggal lahir'}</span>
        <Icon name="calendar" className="w-4 h-4 text-slate-500 shrink-0" />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
          className="bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <button
              type="button"
              onClick={() => setShowYearPicker(p => !p)}
              className="flex items-center gap-1 text-sm font-semibold text-white hover:text-blue-400 transition-colors"
            >
              {MONTHS_ID[viewMonth]} {viewYear}
              <Icon name={showYearPicker ? 'chevron-up' : 'chevron-down'} className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {!showYearPicker && (
              <div className="flex gap-1">
                <button type="button" onClick={prevMonth}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                  <Icon name="chevron-left" className="w-4 h-4" />
                </button>
                <button type="button" onClick={nextMonth}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                  <Icon name="chevron-right" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {showYearPicker ? (
            /* Year grid */
            <div className="grid grid-cols-4 gap-1 px-3 pb-3">
              {yearRange.map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => { setViewYear(y); setShowYearPicker(false); }}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    y === viewYear
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            /* Day grid */
            <div className="px-3 pb-3">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_ID.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-slate-500 py-1">{d}</div>
                ))}
              </div>
              {/* Cells */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {day !== null ? (
                      <button
                        type="button"
                        onClick={() => selectDay(day)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          isSelected(day)
                            ? 'bg-blue-500 text-white'
                            : isToday(day)
                              ? 'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10'
                              : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                ))}
              </div>

              {/* Clear */}
              {value && (
                <div className="pt-2 border-t border-slate-700/40 mt-2">
                  <button
                    type="button"
                    onClick={() => { onChange(''); setOpen(false); }}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Hapus tanggal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

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

  const BASE_ROLES = `/api/proxy/v1/roles`;

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ data: RoleOption[]; total: number }>(`${BASE_ROLES}?limit=100`)
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
  }, [BASE_ROLES, roleId]);

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
                      placeholder="email@perusahaan.com" autoComplete="off"
                      className={inputCls(errors.email)} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                )}

                <div>
                  <Label>Role</Label>
                  {rolesLoading ? (
                    <div className="h-10 bg-slate-700/50 rounded-lg animate-pulse" />
                  ) : (
                    <ModalSelect
                      value={roleId}
                      onChange={setRoleId}
                      error={!!errors.roleId}
                      options={[
                        { value: '', label: '-- Pilih Role --' },
                        ...roles.map(r => ({ value: r.id, label: r.name })),
                      ]}
                    />
                  )}
                  {errors.roleId && <p className="text-red-400 text-xs mt-1">{errors.roleId}</p>}
                </div>

                {mode === 'add' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Password</Label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="min. 8 karakter" autoComplete="new-password"
                        className={inputCls(errors.password)} />
                      {errors.password
                        ? <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                        : <p className="text-slate-600 text-xs mt-1">Huruf besar, kecil, angka & simbol</p>
                      }
                    </div>
                    <div>
                      <Label>Konfirmasi Password</Label>
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="ulangi password" autoComplete="new-password"
                        className={inputCls(errors.confirmPassword)} />
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
                  <ModalSelect
                    value={gender}
                    onChange={v => setGender(v as Gender | '')}
                    error={!!errors.gender}
                    options={[
                      { value: '', label: '-- Pilih --' },
                      ...GENDERS.map(g => ({ value: g.value, label: g.label })),
                    ]}
                  />
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
                    <ModalDatePicker value={birthDate} onChange={setBirthDate} />
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
