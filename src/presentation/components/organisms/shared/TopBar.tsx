/**
 * Organism: TopBar
 * Global top bar with page title, search, notification bell, and dark/light mode toggle.
 * Used across all page templates.
 */
'use client';

import React from 'react';
import { Icon } from '../../atoms/Icon';
import { useTheme } from '../../providers/ThemeProvider';

interface TopBarProps {
  title:    string;
  subtitle?: string;
  action?:  React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, action }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left: title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Cari..."
            className="w-56 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 pl-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <Icon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Notification bell */}
        <button className="relative p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors">
          <Icon name="bell" className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark / Light toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
        >
          <Icon
            name={isDark ? 'sun' : 'moon'}
            className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors"
          />
          <span className="text-xs font-medium text-slate-500 group-hover:text-blue-400 transition-colors">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Optional action button (e.g. Add New) */}
        {action}
      </div>
    </div>
  );
};
