/**
 * Organism Component: AddUserModal / EditUserModal
 * Modal dialog for creating or editing a user
 */

'use client';

import React, { useState } from 'react';
import { User, UserRole, UserStatus, CreateUserDTO, UpdateUserDTO } from '@/src/domain/entities/User';
import { Icon } from '../atoms/Icon';

interface UserModalProps {
  mode:     'add' | 'edit';
  user?:    User;               // only required for edit mode
  onClose:  () => void;
  onSubmit: (data: CreateUserDTO | UpdateUserDTO) => Promise<void>;
  saving?:  boolean;
}

const ROLES: UserRole[]    = ['Admin', 'Manager', 'Staff'];
const STATUSES: UserStatus[] = ['Active', 'Inactive'];

export const UserModal: React.FC<UserModalProps> = ({
  mode,
  user,
  onClose,
  onSubmit,
  saving = false
}) => {
  const [name,     setName]     = useState(user?.name     ?? '');
  const [email,    setEmail]    = useState(user?.email    ?? '');
  const [role,     setRole]     = useState<UserRole>(user?.role     ?? 'Staff');
  const [status,   setStatus]   = useState<UserStatus>(user?.status ?? 'Active');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim())   errs.name  = 'Name is required';
    if (!email.trim())  errs.email = 'Email is required';
    if (email && !email.includes('@')) errs.email = 'Invalid email format';
    if (mode === 'add' && !password)   errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'add') {
      await onSubmit({ name, email, role, password } as CreateUserDTO);
    } else {
      await onSubmit({ id: user!.id, name, email, role, status } as UpdateUserDTO);
    }
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icon name={mode === 'add' ? 'plus' : 'edit'} className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {mode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors ${
                errors.name ? 'border-red-500/60' : 'border-slate-700/50'
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@company.com"
              className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors ${
                errors.email ? 'border-red-500/60' : 'border-slate-700/50'
              }`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Role + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors appearance-none cursor-pointer"
              >
                {ROLES.map(r => (
                  <option key={r} value={r} className="bg-slate-900">{r}</option>
                ))}
              </select>
            </div>

            {mode === 'edit' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as UserStatus)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors appearance-none cursor-pointer"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Password (add only) */}
          {mode === 'add' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900/50 border rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors ${
                    errors.password ? 'border-red-500/60' : 'border-slate-700/50'
                  }`}
                />
                <Icon name="lock" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {mode === 'add' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
