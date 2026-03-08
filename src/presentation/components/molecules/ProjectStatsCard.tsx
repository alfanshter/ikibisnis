/**
 * Molecule: ProjectStatsCard
 * Summary metric card for the stats bar.
 */
'use client';
import React from 'react';
import { Icon } from '../atoms/Icon';

interface Props {
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'amber' | 'emerald' | 'sky' | 'red' | 'purple' | 'teal';
  sub?: string;
}

const COLOR_MAP = {
  blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    value: 'text-blue-300'    },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   value: 'text-amber-300'   },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', value: 'text-emerald-300' },
  sky:     { bg: 'bg-sky-500/10',     icon: 'text-sky-400',     value: 'text-sky-300'     },
  red:     { bg: 'bg-red-500/10',     icon: 'text-red-400',     value: 'text-red-300'     },
  purple:  { bg: 'bg-purple-500/10',  icon: 'text-purple-400',  value: 'text-purple-300'  },
  teal:    { bg: 'bg-teal-500/10',    icon: 'text-teal-400',    value: 'text-teal-300'    },
};

export const ProjectStatsCard: React.FC<Props> = ({ label, value, icon, color, sub }) => {
  const c = COLOR_MAP[color];
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${c.bg} border border-white/5`}>
      <div className={`p-2.5 rounded-lg bg-slate-800/80`}>
        <Icon name={icon} className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs truncate">{label}</p>
        <p className={`font-bold text-lg leading-tight ${c.value}`}>{value}</p>
        {sub && <p className="text-slate-500 text-xs">{sub}</p>}
      </div>
    </div>
  );
};
