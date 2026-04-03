/**
 * Organism: IncomeStatementTable
 * Laba Rugi — single-column financial statement layout.
 */
'use client';
import React from 'react';
import { IncomeStatement, IncomeStatementLine, formatCurrencyIdr } from '@/src/domain/entities/Finance';
import { Icon } from '@/src/presentation/components/atoms/Icon';

const PERIODS = ['Januari 2026', 'Februari 2026', 'Maret 2026'];

const LineRow: React.FC<{ line: IncomeStatementLine; positive?: boolean }> = ({ line, positive }) => {
  const amtColor = positive
    ? 'text-emerald-400'
    : line.amount < 0 ? 'text-red-400' : 'text-white';

  if (line.isTotal) {
    return (
      <tr className="border-t-2 border-slate-500 bg-slate-800/30">
        <td className="px-5 py-3 text-white font-bold text-sm">{line.name}</td>
        <td className={`px-5 py-3 font-bold text-sm text-right whitespace-nowrap ${
          line.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {formatCurrencyIdr(line.amount)}
        </td>
      </tr>
    );
  }

  if (line.isSubtotal) {
    return (
      <tr className="border-t border-slate-700/50">
        <td className="px-5 py-2.5 text-slate-200 font-semibold text-sm">{line.name}</td>
        <td className={`px-5 py-2.5 font-semibold text-sm text-right whitespace-nowrap ${amtColor}`}>
          {formatCurrencyIdr(line.amount)}
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-700/10 transition-colors">
      <td className="px-5 py-2 pl-9 text-slate-400 text-sm">{line.name}</td>
      <td className={`px-5 py-2 text-sm text-right whitespace-nowrap ${amtColor}`}>
        {formatCurrencyIdr(line.amount)}
      </td>
    </tr>
  );
};

const SectionHeader: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <tr>
    <td colSpan={2} className={`px-5 pt-4 pb-1.5 text-xs font-bold uppercase tracking-widest ${color}`}>
      {title}
    </td>
  </tr>
);

const SubtotalRow: React.FC<{ label: string; amount: number; color?: string }> = ({ label, amount, color = '' }) => (
  <tr className="border-t border-slate-600">
    <td className={`px-5 py-2.5 font-semibold text-sm ${color || 'text-slate-200'}`}>{label}</td>
    <td className={`px-5 py-2.5 font-semibold text-sm text-right whitespace-nowrap ${
      color || (amount >= 0 ? 'text-emerald-400' : 'text-red-400')
    }`}>
      {formatCurrencyIdr(amount)}
    </td>
  </tr>
);

interface Props {
  data:           IncomeStatement;
  loading:        boolean;
  period:         string;
  onPeriodChange: (p: string) => void;
}

export const IncomeStatementTable: React.FC<Props> = ({ data, loading, period, onPeriodChange }) => (
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
          <h3 className="text-white font-semibold text-lg">LAPORAN LABA RUGI</h3>
          <p className="text-slate-400 text-sm">{data.period}</p>
        </div>

        <table className="w-full">
          <tbody>
            {/* Revenue */}
            <SectionHeader title="Pendapatan" color="text-emerald-400" />
            {data.revenue.map((l, i) => <LineRow key={i} line={l} positive />)}

            {/* COGS */}
            <SectionHeader title="Harga Pokok Penjualan (HPP)" color="text-amber-400" />
            {data.cogs.map((l, i) => <LineRow key={i} line={l} />)}

            {/* Gross Profit */}
            <SubtotalRow label="LABA KOTOR" amount={data.grossProfit} />

            {/* OPEX */}
            <SectionHeader title="Biaya Operasional" color="text-red-400" />
            {data.opex.map((l, i) => <LineRow key={i} line={l} />)}

            {/* Operating Profit */}
            <SubtotalRow label="LABA OPERASIONAL" amount={data.operatingProfit} />

            {/* Other income */}
            {data.otherIncome.length > 0 && (
              <>
                <SectionHeader title="Pendapatan Lain-lain" color="text-blue-400" />
                {data.otherIncome.map((l, i) => <LineRow key={i} line={l} positive />)}
              </>
            )}

            {/* Other expense */}
            {data.otherExpense.length > 0 && (
              <>
                <SectionHeader title="Beban Lain-lain" color="text-orange-400" />
                {data.otherExpense.map((l, i) => <LineRow key={i} line={l} />)}
              </>
            )}

            {/* EBT */}
            <SubtotalRow label="LABA SEBELUM PAJAK" amount={data.ebt} />

            {/* Tax */}
            <tr className="hover:bg-slate-700/10 transition-colors">
              <td className="px-5 py-2 pl-9 text-slate-400 text-sm">Pajak Penghasilan</td>
              <td className="px-5 py-2 text-sm text-right text-red-400 whitespace-nowrap">
                ({formatCurrencyIdr(data.tax)})
              </td>
            </tr>

            {/* Net Income */}
            <tr className="border-t-2 border-emerald-500/50 bg-emerald-900/10">
              <td className="px-5 py-4 text-emerald-300 font-bold text-base">LABA BERSIH</td>
              <td className={`px-5 py-4 font-bold text-base text-right whitespace-nowrap ${
                data.netIncome >= 0 ? 'text-emerald-300' : 'text-red-300'
              }`}>
                {formatCurrencyIdr(data.netIncome)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
  </div>
);
