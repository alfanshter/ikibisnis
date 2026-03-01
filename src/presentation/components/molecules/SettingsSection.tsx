/**
 * Molecule: SettingsSection
 * A card container with a header (icon + title + description).
 */
'use client';
import React from 'react';
import { Icon } from '@/src/presentation/components/atoms/Icon';

interface Props {
  icon:        string;
  title:       string;
  description: string;
  children:    React.ReactNode;
  action?:     React.ReactNode; // optional header-right button
}

export const SettingsSection: React.FC<Props> = ({ icon, title, description, children, action }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Icon name={icon} className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{description}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
    {/* Body */}
    <div className="px-6 py-5 space-y-4">
      {children}
    </div>
  </div>
);
