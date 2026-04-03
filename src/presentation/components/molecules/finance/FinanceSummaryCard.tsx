/**
 * Molecule: FinanceSummaryCard
 * Compact metric card for finance pages (pemasukan, pengeluaran, saldo).
 */
'use client';
import React from 'react';
import { Icon } from '../../atoms/Icon';

interface Props {
  label:  string;
  value:  string;
  icon:   string;
  trend?: 'up' | 'down' | 'neutral';
  sub?:   string;
}

const TREND_CLS = {
  up:      { wrap: 'bg-emerald-500/10 border-emerald-500/20', icon: 'text-emerald-400', value: 'text-emerald-300' },
  down:    { wrap: 'bg-red-500/10     border-red-500/20',     icon: 'text-red-400',     value: 'text-red-300'     },
  neutral: { wrap: 'bg-blue-500/10    border-blue-500/20',    icon: 'text-blue-400',    value: 'text-blue-300'    },
};

export const FinanceSummaryCard: React.FC<Props> = ({ label, value, icon, trend = 'neutral', sub }) => {
  const c = TREND_CLS[trend];
  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl border ${c.wrap}`}>
      <div className="p-3 rounded-xl bg-slate-800/80">
        <Icon name={icon} className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs mb-0.5">{label}</p>
        <p className={`font-bold text-xl leading-tight ${c.value}`}>{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};
