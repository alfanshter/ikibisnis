/**
 * Template: RoleManagementTemplate
 * Fully connected to the real /api/v1/roles API.
 * Clean architecture: template receives state + callbacks from useRoleManagement hook.
 */

'use client';

import React, { useState } from 'react';
import {
  Role,
  RoleCollection,
  CreateRoleApiDTO,
  UpdateRoleApiDTO,
  RolePermission,
  FeatureAction,
  SystemFeature,
  FEATURE_LABELS,
  FEATURE_GROUPS,
  ALL_ACTIONS,
  GetRolesQuery,
} from '@/src/domain/entities/Role';
import { ToastState } from '@/src/presentation/hooks/user/useRoleManagement';
import { Sidebar }   from '../organisms/Sidebar';
import { TopBar }    from '../organisms/TopBar';
import { Icon }      from '../atoms/Icon';
import { usePermission } from '@/src/presentation/hooks/auth/usePermission';

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  '#DC2626','#EA580C','#D97706','#CA8A04','#65A30D',
  '#16A34A','#0D9488','#0284C7','#4F46E5','#7C3AED',
  '#9333EA','#C026D3','#DB2777','#6B7280',
];

function badgeStyle(color: string) {
  return {
    backgroundColor: `${color}25`,
    color,
    borderColor: `${color}60`,
  };
}

function getActionColor(action: FeatureAction) {
  const map: Record<FeatureAction, string> = {
    read:   'text-sky-400 bg-sky-500/10 border-sky-500/30',
    write:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    update: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    delete: 'text-red-400 bg-red-500/10 border-red-500/30',
  };
  return map[action];
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({
  checked, onChange, disabled = false,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
      checked ? 'bg-blue-500' : 'bg-slate-600/60'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`inline-block w-4 h-4 mt-0.5 ml-0.5 bg-white rounded-full shadow transition-transform duration-200 ${
      checked ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </button>
);

// ── CreateRoleModal ───────────────────────────────────────────────────────────
interface CreateRoleModalProps {
  open:    boolean;
  saving:  boolean;
  onClose: () => void;
  onSubmit:(dto: CreateRoleApiDTO) => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ open, saving, onClose, onSubmit }) => {
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [badgeColor,  setBadgeColor]  = useState('#4F46E5');
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setName(''); setDescription(''); setBadgeColor('#4F46E5');
      setPermissions([]); setErrors({});
    }
  }, [open]);

  const toggleAction = (feature: SystemFeature, action: FeatureAction) => {
    setPermissions(prev => {
      const existing = prev.find(p => p.feature === feature);
      if (!existing) {
        return [...prev, { feature, actions: [action] }];
      }
      const has = existing.actions.includes(action);
      const newActions = has
        ? existing.actions.filter(a => a !== action)
        : [...existing.actions, action];
      if (!newActions.length) return prev.filter(p => p.feature !== feature);
      return prev.map(p => p.feature === feature ? { ...p, actions: newActions } : p);
    });
  };

  const hasAction = (feature: SystemFeature, action: FeatureAction) =>
    permissions.find(p => p.feature === feature)?.actions.includes(action) ?? false;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())         e.name = 'Nama role wajib diisi';
    if (name.trim().length < 2) e.name = 'Minimal 2 karakter';
    if (!description.trim()) e.description = 'Deskripsi wajib diisi';
    if (!permissions.length) e.permissions = 'Minimal 1 permission harus dipilih';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), description: description.trim(), badgeColor, permissions });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center">
              <Icon name="shield" className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Buat Role Baru</h2>
              <p className="text-slate-500 text-xs">Tambahkan role kustom ke sistem</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="create-role-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 min-h-0 px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Nama Role <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
              placeholder="cth. Supervisor, Auditor…"
              maxLength={40}
              className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                errors.name ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-700/60 focus:ring-blue-500/30 focus:border-blue-500/50'
              }`}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Deskripsi <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })); }}
              placeholder="Jelaskan tanggung jawab role ini…"
              rows={2}
              maxLength={150}
              className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.description ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-700/60 focus:ring-blue-500/30 focus:border-blue-500/50'
              }`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Badge Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Warna Badge
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DEFAULT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBadgeColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-all ${
                    badgeColor === c
                      ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white/50 scale-110'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-xs">Custom:</span>
              <input
                type="color"
                value={badgeColor}
                onChange={e => setBadgeColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={badgeStyle(badgeColor)}
              >
                {name || 'Role Name'}
              </span>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Permissions <span className="text-red-400">*</span>
              </label>
              {errors.permissions && <p className="text-red-400 text-xs">{errors.permissions}</p>}
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_repeat(4,52px)] gap-1 px-4 py-2.5 border-b border-slate-700/30">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feature</span>
                {ALL_ACTIONS.map(a => (
                  <span key={a} className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">{a.charAt(0).toUpperCase()}</span>
                ))}
              </div>
              {FEATURE_GROUPS.map(group => (
                <React.Fragment key={group.group}>
                  <div className="px-4 py-1.5 bg-slate-700/20 border-b border-slate-700/20">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{group.group}</span>
                  </div>
                  {group.features.map((feature, i) => (
                    <div
                      key={feature}
                      className={`grid grid-cols-[1fr_repeat(4,52px)] gap-1 px-4 py-2.5 items-center ${
                        i < group.features.length - 1 ? 'border-b border-slate-700/15' : ''
                      }`}
                    >
                      <span className="text-slate-300 text-xs">{FEATURE_LABELS[feature]}</span>
                      {ALL_ACTIONS.map(action => (
                        <div key={action} className="flex justify-center">
                          <Toggle
                            checked={hasAction(feature, action)}
                            onChange={() => toggleAction(feature, action)}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl border border-slate-700/60 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            form="create-role-form"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon name="plus" className="w-4 h-4" />
            )}
            Buat Role
          </button>
        </div>
      </div>
    </div>
  );
};

// ── EditRoleModal ─────────────────────────────────────────────────────────────
interface EditRoleModalProps {
  role:    Role;
  saving:  boolean;
  onClose: () => void;
  onSubmit:(id: string, dto: UpdateRoleApiDTO) => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ role, saving, onClose, onSubmit }) => {
  const [name,        setName]        = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [badgeColor,  setBadgeColor]  = useState(role.badgeColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(role.id, {
      name:        name.trim()        || undefined,
      description: description.trim() || undefined,
      badgeColor:  badgeColor         || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <h2 className="text-white font-bold text-base">Edit Role</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>
        <form id="edit-role-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nama</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Warna Badge</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {DEFAULT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setBadgeColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-all ${
                    badgeColor === c ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white/50 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={badgeColor} onChange={e => setBadgeColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
              <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={badgeStyle(badgeColor)}>
                {name || 'Role'}
              </span>
            </div>
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700/50">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl border border-slate-700/60 transition-all">
            Batal
          </button>
          <button type="submit" form="edit-role-form" disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icon name="check" className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// ── DeleteConfirmModal ────────────────────────────────────────────────────────
interface DeleteConfirmProps {
  role:    Role;
  saving:  boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const DeleteConfirmModal: React.FC<DeleteConfirmProps> = ({ role, saving, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-6">
      <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="trash" className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-white font-bold text-center text-base mb-1">Hapus Role?</h3>
      <p className="text-slate-400 text-sm text-center mb-6">
        Role <span className="text-white font-semibold">{role.name}</span> akan di-soft-delete. Bisa dipulihkan nanti.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl border border-slate-700/60 transition-all">
          Batal
        </button>
        <button onClick={onConfirm} disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
          {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

// ── PermissionMatrix ──────────────────────────────────────────────────────────
interface PermissionMatrixProps {
  role:     Role;
  saving:   boolean;
  loading:  boolean;
  onChange: (updated: Role) => void;
  onSave:   () => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ role, saving, loading, onChange, onSave }) => {
  const getActions = (feature: SystemFeature): FeatureAction[] =>
    role.permissions.find(p => p.feature === feature)?.actions ?? [];

  const toggle = (feature: SystemFeature, action: FeatureAction) => {
    const current = getActions(feature);
    const has     = current.includes(action);
    const newActions = has ? current.filter(a => a !== action) : [...current, action];

    const newPerms: RolePermission[] = newActions.length
      ? role.permissions.some(p => p.feature === feature)
        ? role.permissions.map(p => p.feature === feature ? { ...p, actions: newActions } : p)
        : [...role.permissions, { feature, actions: newActions }]
      : role.permissions.filter(p => p.feature !== feature);

    onChange({ ...role, permissions: newPerms });
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-700/50 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Permission Matrix</p>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg">{role.name}</h2>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                  style={badgeStyle(role.badgeColor)}
                >
                  {role.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">{role.description}</p>
            </div>
          </div>
          <button
            onClick={onSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all"
          >
            {saving
              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Icon name="check" className="w-4 h-4" />
            }
            Save Permissions
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr_repeat(4,72px)] gap-x-2 px-6 py-3 border-b border-slate-700/30 shrink-0">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Feature</p>
        {ALL_ACTIONS.map(a => (
          <p key={a} className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">{a}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          FEATURE_GROUPS.map(group => (
            <React.Fragment key={group.group}>
              {/* Group header */}
              <div className="px-6 py-2 bg-slate-700/20 sticky top-0 z-10">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{group.group}</span>
              </div>
              {group.features.map(feature => {
                const actions = getActions(feature as SystemFeature);
                return (
                  <div
                    key={feature}
                    className="grid grid-cols-[1fr_repeat(4,72px)] gap-x-2 px-6 py-3.5 items-center border-b border-slate-700/15 hover:bg-slate-700/10 transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{FEATURE_LABELS[feature as SystemFeature]}</p>
                      <p className="text-slate-600 text-xs font-mono">{feature}</p>
                    </div>
                    {ALL_ACTIONS.map(action => (
                      <div key={action} className="flex justify-center">
                        <Toggle
                          checked={actions.includes(action)}
                          onChange={() => toggle(feature as SystemFeature, action)}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="px-6 py-3.5 border-t border-slate-700/30 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {role.permissions.map(p => (
              <div key={p.feature} className="flex items-center gap-1 bg-slate-700/40 rounded-lg px-2 py-1">
                <span className="text-slate-400 text-[10px] font-mono">{p.feature}:</span>
                {p.actions.map(a => (
                  <span key={a} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getActionColor(a)}`}>{a[0].toUpperCase()}</span>
                ))}
              </div>
            ))}
            {!role.permissions.length && (
              <span className="text-slate-500 text-xs">Belum ada permission yang diatur</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── RoleCard (left panel) ─────────────────────────────────────────────────────
interface RoleCardProps {
  role:      Role;
  selected:  boolean;
  onSelect:  (r: Role) => void;
  onEdit:    (r: Role) => void;
  onDelete:  (r: Role) => void;
  onToggle:  (r: Role) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, selected, onSelect, onEdit, onDelete, onToggle, canUpdate = true, canDelete = true }) => {
  const permCount = role.permissions.reduce((s, p) => s + p.actions.length, 0);

  return (
    <div
      onClick={() => onSelect(role)}
      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer group ${
        selected
          ? 'bg-blue-500/10 border-blue-500/50'
          : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Color dot */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
          style={{ backgroundColor: `${role.badgeColor}25`, color: role.badgeColor }}
        >
          {role.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm truncate ${selected ? 'text-white' : 'text-slate-300'}`}>{role.name}</p>
            {!role.isActive && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 shrink-0">OFF</span>
            )}
          </div>
          <p className="text-slate-500 text-xs truncate">{permCount} permission{permCount !== 1 ? 's' : ''}</p>
        </div>

        {selected
          ? <Icon name="check-circle" className="w-5 h-5 text-blue-400 shrink-0" />
          : <Icon name="chevron-right" className="w-4 h-4 text-slate-600 shrink-0" />
        }
      </div>

      {/* Actions — visible on hover */}
      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        {canUpdate ? (
          <button
            onClick={() => onEdit(role)}
            className="flex-1 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-700/40 hover:bg-slate-700 rounded-lg transition-all"
          >
            Edit
          </button>
        ) : (
          <span className="flex-1 py-1 flex items-center justify-center text-slate-600 bg-slate-700/20 rounded-lg cursor-not-allowed" title="Tidak ada izin edit">
            <Icon name="lock" className="w-3 h-3" />
          </span>
        )}
        {canUpdate ? (
          <button
            onClick={() => onToggle(role)}
            className="flex-1 py-1 text-[11px] font-medium text-slate-400 hover:text-amber-400 bg-slate-700/40 hover:bg-amber-500/10 rounded-lg transition-all"
          >
            {role.isActive ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
        ) : (
          <span className="flex-1 py-1 flex items-center justify-center text-slate-600 bg-slate-700/20 rounded-lg cursor-not-allowed" title="Tidak ada izin ubah status">
            <Icon name="lock" className="w-3 h-3" />
          </span>
        )}
        {canDelete ? (
          <button
            onClick={() => onDelete(role)}
            className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-red-400 bg-slate-700/40 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="px-2 py-1 flex items-center justify-center text-slate-600 bg-slate-700/20 rounded-lg cursor-not-allowed" title="Tidak ada izin hapus">
            <Icon name="lock" className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
};

// ── Template Props ────────────────────────────────────────────────────────────
export interface RoleManagementTemplateProps {
  collection:         RoleCollection | null;
  selectedRole:       Role | null;
  query:              GetRolesQuery;
  listLoading:        boolean;
  detailLoading:      boolean;
  saving:             boolean;
  toast:              ToastState | null;
  showCreateModal:    boolean;
  showEditModal:      boolean;
  showDeleteConfirm:  boolean;
  editingRole:        Role | null;
  deletingRole:       Role | null;
  onSelectRole:       (r: Role)  => void;
  onPermissionsChange:(r: Role)  => void;
  onSavePermissions:  ()         => void;
  onToggleStatus:     (r: Role)  => void;
  onOpenCreateModal:  ()         => void;
  onCloseCreateModal: ()         => void;
  onCreateRole:       (dto: CreateRoleApiDTO) => void;
  onOpenEditModal:    (r: Role)  => void;
  onCloseEditModal:   ()         => void;
  onUpdateRole:       (id: string, dto: UpdateRoleApiDTO) => void;
  onOpenDeleteConfirm:(r: Role)  => void;
  onCloseDeleteConfirm:()        => void;
  onDeleteRole:       ()         => void;
  onSearch:           (s: string) => void;
  onFilterActive:     (v?: boolean) => void;
  onPageChange:       (p: number)   => void;
  onRefresh:          ()            => void;
}

// ── Main Template ─────────────────────────────────────────────────────────────
export const RoleManagementTemplate: React.FC<RoleManagementTemplateProps> = ({
  collection, selectedRole, query,
  listLoading, detailLoading, saving,
  toast,
  showCreateModal, showEditModal, showDeleteConfirm,
  editingRole, deletingRole,
  onSelectRole, onPermissionsChange, onSavePermissions,
  onToggleStatus,
  onOpenCreateModal, onCloseCreateModal, onCreateRole,
  onOpenEditModal, onCloseEditModal, onUpdateRole,
  onOpenDeleteConfirm, onCloseDeleteConfirm, onDeleteRole,
  onSearch, onFilterActive, onRefresh,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const { canWrite, canUpdate, canDelete } = usePermission('user_management_roles');
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activePage="User Management" />

      <main className="flex-1 ml-64 p-8 flex flex-col gap-6">
        <TopBar
          title="Roles & Permissions"
          subtitle="Kelola role dan hak akses berdasarkan fitur sistem."
        />

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={searchInput}
              onChange={e => { setSearchInput(e.target.value); if (!e.target.value) onSearch(''); }}
              placeholder="Cari role…"
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </form>

          <select
            value={query.isActive === undefined ? '' : String(query.isActive)}
            onChange={e => onFilterActive(e.target.value === '' ? undefined : e.target.value === 'true')}
            className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Refresh"
          >
            <Icon name="refresh" className="w-4 h-4" />
          </button>

          {canWrite ? (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all ml-auto"
          >
            <Icon name="plus" className="w-4 h-4" />
            New Role
          </button>
          ) : (
          <span className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-500 text-sm font-semibold rounded-xl ml-auto cursor-not-allowed border border-slate-700/50" title="Tidak ada izin tambah role">
            <Icon name="lock" className="w-4 h-4" />
            New Role
          </span>
          )}
        </div>

        {/* Two-panel layout */}
        <div className="flex gap-6 items-start min-h-0 flex-1">
          {/* ── Left: Role List ── */}
          <div className="w-72 shrink-0 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Active Roles
                {collection && (
                  <span className="ml-2 text-slate-600 font-normal">({collection.total})</span>
                )}
              </p>
            </div>

            {listLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-800/40 rounded-xl border border-slate-700/50 animate-pulse" />
              ))
            ) : collection?.data.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm bg-slate-800/40 rounded-xl border border-slate-700/50">
                Tidak ada role ditemukan
              </div>
            ) : (
              collection?.data.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  selected={selectedRole?.id === role.id}
                  onSelect={onSelectRole}
                  onEdit={onOpenEditModal}
                  onDelete={onOpenDeleteConfirm}
                  onToggle={onToggleStatus}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
              ))
            )}
          </div>

          {/* ── Right: Permission Matrix ── */}
          <div className="flex-1 min-w-0">
            {selectedRole ? (
              <PermissionMatrix
                role={selectedRole}
                saving={saving}
                loading={detailLoading}
                onChange={onPermissionsChange}
                onSave={onSavePermissions}
              />
            ) : (
              <div className="h-full min-h-64 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon name="shield" className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-slate-500 text-sm">Pilih role di sebelah kiri</p>
                  <p className="text-slate-600 text-xs mt-1">untuk melihat permission matrix</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <Icon name={toast.type === 'success' ? 'check' : 'x'} className="w-4 h-4" />
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      <CreateRoleModal
        open={showCreateModal}
        saving={saving}
        onClose={onCloseCreateModal}
        onSubmit={onCreateRole}
      />

      {showEditModal && editingRole && (
        <EditRoleModal
          role={editingRole}
          saving={saving}
          onClose={onCloseEditModal}
          onSubmit={onUpdateRole}
        />
      )}

      {showDeleteConfirm && deletingRole && (
        <DeleteConfirmModal
          role={deletingRole}
          saving={saving}
          onClose={onCloseDeleteConfirm}
          onConfirm={onDeleteRole}
        />
      )}
    </div>
  );
};
