/**
 * Organism: CashFlowTable
 * Arus Kas — Operating / Investing / Financing sections + summary.
 */
'use client';
import React from 'react';
import { CashFlow, CashFlowSection, formatCurrencyIdr } from '@/src/domain/entities/Finance';
import { Icon } from '@/src/presentation/components/atoms/Icon';

const PERIODS = ['Januari 2026', 'Februari 2026', 'Maret 2026'];

const SECTION_STYLES: Record<string, { header: string; total: string }> = {
  'Aktivitas Operasi':    { header: 'text-blue-400',   total: 'text-blue-300'   },
  'Aktivitas Investasi':  { header: 'text-purple-400', total: 'text-purple-300' },
  'Aktivitas Pendanaan':  { header: 'text-amber-400',  total: 'text-amber-300'  },
};

const CashSection: React.FC<{ section: CashFlowSection }> = ({ section }) => {
  const style = SECTION_STYLES[section.title] ?? { header: 'text-slate-300', total: 'text-slate-200' };
  return (
    <div className="border-b border-slate-700/50 last:border-b-0">
      {/* Section header */}
      <div className={`px-5 pt-4 pb-2 text-xs font-bold uppercase tracking-widest ${style.header}`}>
        {section.title}
      </div>
      <table className="w-full">
        <tbody>
          {section.lines.map((line, i) => (
            <tr key={i} className="hover:bg-slate-700/10 transition-colors">
              <td className="px-5 py-2 pl-9 text-slate-400 text-sm">{line.name}</td>
              <td className={`px-5 py-2 text-sm text-right whitespace-nowrap ${
                line.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {line.amount >= 0
                  ? `+${formatCurrencyIdr(line.amount)}`
                  : `(${formatCurrencyIdr(Math.abs(line.amount))})`}
              </td>
            </tr>
          ))}
          {/* Section total */}
          <tr className="border-t border-slate-600">
            <td className={`px-5 py-2.5 font-semibold text-sm ${style.total}`}>
              Arus Kas Bersih — {section.title}
            </td>
            <td className={`px-5 py-2.5 font-semibold text-sm text-right whitespace-nowrap ${
              section.total >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {section.total >= 0
                ? `+${formatCurrencyIdr(section.total)}`
                : `(${formatCurrencyIdr(Math.abs(section.total))})`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface Props {
  data:           CashFlow;
  loading:        boolean;
  period:         string;
  onPeriodChange: (p: string) => void;
}

export const CashFlowTable: React.FC<Props> = ({ data, loading, period, onPeriodChange }) => (
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
          <h3 className="text-white font-semibold text-lg">LAPORAN ARUS KAS</h3>
          <p className="text-slate-400 text-sm">{data.period}</p>
        </div>

        {/* Sections */}
        <CashSection section={data.operating} />
        <CashSection section={data.investing} />
        <CashSection section={data.financing} />

        {/* Summary */}
        <div className="border-t-2 border-slate-600 bg-slate-800/30">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-5 py-3 text-slate-300 text-sm">Saldo Kas Awal Periode</td>
                <td className="px-5 py-3 text-slate-300 text-sm text-right whitespace-nowrap">
                  {formatCurrencyIdr(data.beginningCash)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-2.5 text-slate-300 text-sm">Kenaikan / (Penurunan) Bersih Kas</td>
                <td className={`px-5 py-2.5 text-sm text-right whitespace-nowrap ${
                  data.netCashChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {data.netCashChange >= 0
                    ? `+${formatCurrencyIdr(data.netCashChange)}`
                    : `(${formatCurrencyIdr(Math.abs(data.netCashChange))})`}
                </td>
              </tr>
              <tr className="border-t-2 border-emerald-500/50 bg-emerald-900/10">
                <td className="px-5 py-4 text-emerald-300 font-bold text-base">
                  <div className="flex items-center gap-2">
                    <Icon name="bank" className="w-4 h-4" />
                    Saldo Kas Akhir Periode
                  </div>
                </td>
                <td className="px-5 py-4 text-emerald-300 font-bold text-base text-right whitespace-nowrap">
                  {formatCurrencyIdr(data.endingCash)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);
