/**
 * Organism: BalanceSheetTable
 * Neraca — two-column layout: Aktiva | Kewajiban + Ekuitas
 */
'use client';
import React from 'react';
import { BalanceSheet, BalanceSheetSection, formatCurrencyIdr } from '@/src/domain/entities/Finance';
import { Icon } from '@/src/presentation/components/atoms/Icon';

const PERIODS = ['Januari 2026', 'Februari 2026', 'Maret 2026'];

const SectionGroup: React.FC<{ section: BalanceSheetSection }> = ({ section }) => (
  <div className="mb-4">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5 bg-slate-800/50 rounded">
      {section.title}
    </p>
    <table className="w-full mt-1">
      <tbody>
        {section.items.map((item, i) => (
          <tr key={i}
              className={item.isSubtotal
                ? 'border-t border-slate-700/50'
                : 'hover:bg-slate-700/10 transition-colors'}>
            <td className={`py-1.5 text-sm ${item.isSubtotal ? 'text-slate-200 font-semibold pl-3' : 'text-slate-400 pl-5'}`}>
              {item.name}
            </td>
            <td className={`py-1.5 text-sm text-right pr-3 whitespace-nowrap ${item.isSubtotal ? 'text-white font-semibold' : 'text-slate-300'}`}>
              {formatCurrencyIdr(item.amount)}
            </td>
          </tr>
        ))}
        {/* Section total */}
        <tr className="border-t border-slate-600">
          <td className="py-2 pl-3 text-sm font-bold text-slate-200">
            Total {section.title}
          </td>
          <td className="py-2 pr-3 text-sm font-bold text-white text-right whitespace-nowrap">
            {formatCurrencyIdr(section.total)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

interface Props {
  data:           BalanceSheet;
  loading:        boolean;
  period:         string;
  onPeriodChange: (p: string) => void;
}

export const BalanceSheetTable: React.FC<Props> = ({ data, loading, period, onPeriodChange }) => (
  <div className="space-y-4">
    {/* Period Selector */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-400">Periode:</label>
        <select value={period} onChange={e => onPeriodChange(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors">
          {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors">
        <Icon name="download" className="w-4 h-4" />
        Export PDF
      </button>
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-24 bg-slate-800/50 border border-slate-700 rounded-xl">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    ) : (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {/* Title */}
        <div className="px-6 py-4 border-b border-slate-700 text-center">
          <h3 className="text-white font-semibold text-lg">NERACA</h3>
          <p className="text-slate-400 text-sm">{data.period}</p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
          {/* Left: Aktiva */}
          <div className="p-5">
            <h4 className="text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="bank" className="w-4 h-4" />
              AKTIVA
            </h4>
            {data.assets.map((section, i) => (
              <SectionGroup key={i} section={section} />
            ))}
            {/* Grand Total Aktiva */}
            <div className="border-t-2 border-blue-500/50 mt-2 pt-3">
              <div className="flex justify-between">
                <span className="text-blue-300 font-bold text-sm">TOTAL AKTIVA</span>
                <span className="text-blue-300 font-bold text-sm">{formatCurrencyIdr(data.totalAssets)}</span>
              </div>
            </div>
          </div>

          {/* Right: Kewajiban + Ekuitas */}
          <div className="p-5">
            <h4 className="text-purple-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="scale" className="w-4 h-4" />
              KEWAJIBAN &amp; EKUITAS
            </h4>
            {data.liabilities.map((section, i) => (
              <SectionGroup key={i} section={section} />
            ))}
            {data.equity.map((section, i) => (
              <SectionGroup key={`eq-${i}`} section={section} />
            ))}
            {/* Grand Total */}
            <div className="border-t-2 border-purple-500/50 mt-2 pt-3 space-y-1">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Total Kewajiban</span>
                <span>{formatCurrencyIdr(data.totalLiabilities)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>Total Ekuitas</span>
                <span>{formatCurrencyIdr(data.totalEquity)}</span>
              </div>
              <div className="flex justify-between border-t border-purple-500/30 pt-2">
                <span className="text-purple-300 font-bold text-sm">TOTAL KEW. + EKUITAS</span>
                <span className="text-purple-300 font-bold text-sm">
                  {formatCurrencyIdr(data.totalLiabilities + data.totalEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Check */}
        <div className={`px-6 py-3 border-t border-slate-700 text-center text-xs ${
          Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 1
            ? 'text-emerald-400'
            : 'text-red-400'
        }`}>
          {Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 1
            ? '✓ Neraca seimbang'
            : '⚠ Neraca tidak seimbang — periksa data'}
        </div>
      </div>
    )}
  </div>
);
