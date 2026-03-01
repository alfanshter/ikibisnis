/**
 * Molecule Component: PermissionCheckbox
 * A single permission checkbox (Read / Write / Delete)
 */

import React from 'react';

interface PermissionCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => (
  <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer select-none
    ${checked
      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
      : 'bg-slate-800/50 border-slate-700/50 text-slate-500'}
    ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-slate-500/50'}
  `}>
    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all
      ${checked ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-transparent'}
    `}>
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={e => !disabled && onChange(e.target.checked)}
      disabled={disabled}
    />
    <span className="text-xs font-medium">{label}</span>
  </label>
);
