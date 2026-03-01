/**
 * Molecule: FinanceReportLine
 * A single line item in Neraca / Laba Rugi / Arus Kas tables.
 */
'use client';
import React from 'react';
import { formatCurrencyIdr } from '@/src/domain/entities/Finance';

interface Props {
  name:       string;
  amount:     number;
  isSubtotal?: boolean;
  isTotal?:    boolean;
  indent?:     boolean;
  showSign?:   boolean;
}

export const FinanceReportLine: React.FC<Props> = ({
  name, amount, isSubtotal, isTotal, indent, showSign
}) => {
  const pos = amount >= 0;
  const amtCls = showSign
    ? pos ? 'text-emerald-400' : 'text-red-400'
    : 'text-white';

  if (isTotal) {
    return (
      <tr className="border-t-2 border-slate-500">
        <td className="px-4 py-3 text-white font-bold">{name}</td>
        <td className={`px-4 py-3 font-bold text-right whitespace-nowrap ${amtCls}`}>
          {showSign && pos ? '+' : ''}{formatCurrencyIdr(amount)}
        </td>
      </tr>
    );
  }

  if (isSubtotal) {
    return (
      <tr className="border-t border-slate-600/50 bg-slate-700/20">
        <td className="px-4 py-2.5 text-slate-200 font-semibold text-sm">{name}</td>
        <td className={`px-4 py-2.5 font-semibold text-sm text-right whitespace-nowrap ${amtCls}`}>
          {showSign && pos ? '+' : ''}{formatCurrencyIdr(amount)}
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-800/20 transition-colors">
      <td className={`px-4 py-2 text-slate-400 text-sm ${indent ? 'pl-8' : ''}`}>{name}</td>
      <td className={`px-4 py-2 text-sm text-right whitespace-nowrap ${amtCls}`}>
        {showSign && pos ? '+' : ''}{formatCurrencyIdr(amount)}
      </td>
    </tr>
  );
};
