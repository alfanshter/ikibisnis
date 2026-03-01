/**
 * Organism: AppearanceSettingsForm
 * Accent color, date format, language, compact mode.
 */
'use client';
import React, { useState } from 'react';
import { AppearanceSettings, AccentColor, DateFormat, Language } from '@/src/domain/entities/Settings';
import { SettingsSection } from '@/src/presentation/components/molecules/SettingsSection';
import { SettingsField } from '@/src/presentation/components/molecules/SettingsField';
import { Icon } from '@/src/presentation/components/atoms/Icon';

const ACCENT_COLORS: { value: AccentColor; label: string; cls: string }[] = [
  { value: 'blue',    label: 'Biru',   cls: 'bg-blue-500'    },
  { value: 'purple',  label: 'Ungu',   cls: 'bg-purple-500'  },
  { value: 'emerald', label: 'Hijau',  cls: 'bg-emerald-500' },
  { value: 'rose',    label: 'Merah',  cls: 'bg-rose-500'    },
  { value: 'amber',   label: 'Kuning', cls: 'bg-amber-500'   },
];

interface Props {
  initial: AppearanceSettings;
  saving:  boolean;
  onSave:  (a: AppearanceSettings) => void;
}

export const AppearanceSettingsForm: React.FC<Props> = ({ initial, saving, onSave }) => {
  const [form, setForm] = useState<AppearanceSettings>({ ...initial });

  const set = <K extends keyof AppearanceSettings>(key: K, val: AppearanceSettings[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5">
      {/* Accent Color */}
      <SettingsSection icon="palette" title="Warna Aksen" description="Warna utama antarmuka sistem.">
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => set('accentColor', c.value)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-sm transition-all ${
                form.accentColor === c.value
                  ? 'border-white/40 bg-slate-700 text-white'
                  : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${c.cls}`} />
              {c.label}
              {form.accentColor === c.value && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Regional display */}
      <SettingsSection icon="globe" title="Format & Bahasa" description="Format tanggal dan bahasa antarmuka.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField
            label="Format Tanggal"
            type="select"
            value={form.dateFormat}
            onChange={v => set('dateFormat', v as DateFormat)}
            options={[
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
          />
          <SettingsField
            label="Bahasa"
            type="select"
            value={form.language}
            onChange={v => set('language', v as Language)}
            options={[
              { value: 'id', label: 'Bahasa Indonesia' },
              { value: 'en', label: 'English' },
            ]}
          />
        </div>
      </SettingsSection>

      {/* Display options */}
      <SettingsSection icon="sun" title="Tampilan" description="Preferensi kerapatan tampilan.">
        <SettingsField
          label="Mode Kompak"
          hint="Kurangi jarak antar elemen untuk menampilkan lebih banyak data"
          type="toggle"
          value={form.compactMode}
          onChange={v => set('compactMode', v as boolean)}
        />
      </SettingsSection>

      <div className="flex justify-end">
        <button onClick={() => onSave(form)} disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan…</>
            : <><Icon name="save" className="w-4 h-4" />Simpan Tampilan</>}
        </button>
      </div>
    </div>
  );
};
