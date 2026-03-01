/**
 * Molecule: SettingsField
 * Labeled input / select / textarea row for settings forms.
 */
'use client';
import React from 'react';

type InputType = 'text' | 'email' | 'tel' | 'password' | 'url' | 'textarea' | 'select' | 'toggle';

interface SelectOption { value: string; label: string }

interface Props {
  label:       string;
  hint?:       string;
  error?:      string;
  type?:       InputType;
  value:       string | boolean;
  onChange:    (v: string | boolean) => void;
  placeholder?: string;
  options?:    SelectOption[];    // for select
  rows?:       number;            // for textarea
  disabled?:   boolean;
}

const inputBase =
  'w-full bg-slate-900 border rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 ' +
  'focus:outline-none focus:ring-2 transition-colors';

export const SettingsField: React.FC<Props> = ({
  label, hint, error, type = 'text', value,
  onChange, placeholder, options, rows = 3, disabled
}) => {
  const borderCls = error
    ? 'border-red-500 focus:ring-red-500/50'
    : 'border-slate-600 focus:ring-blue-500/50 focus:border-blue-500';

  const renderInput = () => {
    if (type === 'toggle') {
      const checked = value as boolean;
      return (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-slate-600'
          } disabled:opacity-50`}
        >
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      );
    }

    if (type === 'select') {
      return (
        <select
          value={value as string}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className={`${inputBase} ${borderCls} disabled:opacity-50`}
        >
          {options?.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={value as string}
          disabled={disabled}
          rows={rows}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className={`${inputBase} ${borderCls} resize-none disabled:opacity-50`}
        />
      );
    }

    return (
      <input
        type={type}
        value={value as string}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`${inputBase} ${borderCls} disabled:opacity-50`}
      />
    );
  };

  return (
    <div className={type === 'toggle' ? 'flex items-center justify-between' : ''}>
      <div className={type === 'toggle' ? '' : 'mb-1.5'}>
        <label className="block text-sm font-medium text-slate-300">{label}</label>
        {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <div className={type === 'toggle' ? '' : 'mt-1'}>
        {renderInput()}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    </div>
  );
};
