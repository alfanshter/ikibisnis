/**
 * Organism Component: Sidebar
 * Navigation sidebar with collapsible Finance sub-menu.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../atoms/Icon';
import DIContainer from '@/src/infrastructure/di/container';

interface SidebarProps {
  activePage?: string;
}

const FINANCE_CHILDREN = [
  { name: 'Laporan Harian', icon: 'receipt',    href: '/finance/harian'   },
  { name: 'Neraca',         icon: 'scale',      href: '/finance/neraca'   },
  { name: 'Laba Rugi',      icon: 'chart-bar',  href: '/finance/laba-rugi'},
  { name: 'Arus Kas',       icon: 'water',      href: '/finance/arus-kas' },
];

const MENU_ITEMS = [
  { name: 'Dashboard', icon: 'grid',      href: '/',         children: null },
  { name: 'Users',     icon: 'users',     href: '/users',    children: null },
  { name: 'Projects',  icon: 'briefcase', href: '/projects', children: null },
  { name: 'Finance',   icon: 'credit',    href: '/finance',  children: FINANCE_CHILDREN },
  { name: 'Settings',  icon: 'settings',  href: '/settings', children: null },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const pathname = usePathname();

  const isFinanceActive = pathname.startsWith('/finance');
  const [financeOpen, setFinanceOpen] = useState(isFinanceActive);

  // Dynamic store identity from settings
  const [storeName,    setStoreName]    = useState('Nexus Admin');
  const [storeTagline, setStoreTagline] = useState('MANAGEMENT SYSTEM');
  const [logoInitial,  setLogoInitial]  = useState('N');
  const [logoColor,    setLogoColor]    = useState('blue');
  const [profileName,  setProfileName]  = useState('Alex Rivera');
  const [profileRole,  setProfileRole]  = useState('Super Admin');

  const COLOR_MAP: Record<string, string> = {
    blue:    'bg-blue-500',
    purple:  'bg-purple-500',
    emerald: 'bg-emerald-500',
    rose:    'bg-rose-500',
    amber:   'bg-amber-500',
  };

  useEffect(() => {
    const getUC = DIContainer.getInstance().getGetSettingsUseCase();
    Promise.all([getUC.executeStore(), getUC.executeProfile()]).then(([s, p]) => {
      setStoreName(s.storeName);
      setStoreTagline(s.storeTagline);
      setLogoInitial(s.logoInitial);
      setLogoColor(s.logoColor);
      setProfileName(p.name);
      setProfileRole(p.role);
    }).catch(() => { /* keep defaults */ });
  }, []);

  const isActive = (href: string, name: string): boolean => {
    if (activePage) return activePage === name;
    if (href === '/') return pathname === '/';
    return pathname === href;
  };

  const isParentActive = (href: string, name: string): boolean => {
    if (activePage) return activePage === name;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${COLOR_MAP[logoColor] ?? 'bg-blue-500'} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">{logoInitial}</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{storeName}</h2>
            <p className="text-slate-400 text-xs tracking-widest">{storeTagline}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          if (!item.children) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href, item.name)
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          }

          // Parent with children (Finance)
          const parentActive = isParentActive(item.href, item.name);
          return (
            <div key={item.name}>
              {/* Parent toggle button */}
              <button
                onClick={() => setFinanceOpen(o => !o)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  parentActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                <span className="font-medium flex-1 text-left">{item.name}</span>
                <Icon
                  name={financeOpen ? 'chevron-up' : 'chevron-down'}
                  className="w-4 h-4 transition-transform"
                />
              </button>

              {/* Children */}
              {financeOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-slate-700/50 space-y-0.5">
                  {item.children.map(child => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                        pathname === child.href
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon name={child.icon} className="w-4 h-4 shrink-0" />
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">{profileName[0]?.toUpperCase() ?? 'A'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{profileName}</p>
            <p className="text-slate-400 text-xs truncate">{profileRole}</p>
          </div>
          <Link href="/settings" className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Icon name="settings" className="w-4 h-4" />
          </Link>
        </div>
        <button
          onClick={() => alert('Logout — tambahkan auth provider sesuai kebutuhan.')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
        >
          <Icon name="logout" className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
};
