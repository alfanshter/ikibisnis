/**
 * Organism: DailyReportTable
 * Laporan Harian — date-range filter, grouped by day, paginated.
 */
'use client';
import React, { useState } from 'react';
import { DailyReportResult, formatCurrencyIdr } from '@/src/domain/entities/Finance';
import { Transaction } from '@/src/domain/entities/Finance';
import { TransactionRow } from '@/src/presentation/components/molecules/finance/TransactionRow';
import { Icon } from '@/src/presentation/components/atoms/Icon';

interface Props {
  result:              DailyReportResult;
  loading:             boolean;
  dateFrom:            string;
  dateTo:              string;
  onDateChange:        (from: string, to: string) => void;
  onPageChange:        (page: number) => void;
  onAddTransaction:    () => void;
  onDeleteTransaction: (tx: Transaction) => void;
}

export const DailyReportTable: React.FC<Props> = ({
  result, loading, dateFrom, dateTo,
  onDateChange, onPageChange, onAddTransaction, onDeleteTransaction,
}) => {
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());

  const toggleDay = (date: string) => {
    setOpenDays(prev => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const { reports, pagination } = result;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Dari</label>
          <input type="date" value={dateFrom}
                 onChange={e => onDateChange(e.target.value, dateTo)}
                 className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Sampai</label>
          <input type="date" value={dateTo}
                 onChange={e => onDateChange(dateFrom, e.target.value)}
                 className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" />
        </div>
        <div className="ml-auto">
          <button onClick={onAddTransaction}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Icon name="plus" className="w-4 h-4" />
            Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Icon name="receipt" className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Tidak ada transaksi untuk rentang tanggal ini</p>
          </div>
        ) : (
          <div>
            {reports.map(day => {
              const isOpen = openDays.has(day.date.toISOString());
              return (
                <div key={day.date.toISOString()} className="border-b border-slate-700/50 last:border-b-0">
                  {/* Day Header — always visible */}
                  <button
                    onClick={() => toggleDay(day.date.toISOString())}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-700/30 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={isOpen ? 'chevron-down' : 'chevron-right'}
                            className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      <span className="text-white font-medium text-sm">
                        {day.date.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-slate-500 text-xs">
                        ({day.transactions.length} transaksi)
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-emerald-400">+{formatCurrencyIdr(day.totalPemasukan)}</span>
                      <span className="text-red-400">-{formatCurrencyIdr(day.totalPengeluaran)}</span>
                      <span className="text-slate-300 font-medium w-36 text-right">
                        Saldo: {formatCurrencyIdr(day.saldoAkhir)}
                      </span>
                    </div>
                  </button>

                  {/* Transactions */}
                  {isOpen && (
                    <div className="border-t border-slate-700/50">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                            <th className="px-5 py-2.5 text-left">Tanggal</th>
                            <th className="px-4 py-2.5 text-left">Deskripsi</th>
                            <th className="px-4 py-2.5 text-left">Tipe</th>
                            <th className="px-4 py-2.5 text-left">Metode</th>
                            <th className="px-4 py-2.5 text-right">Nominal</th>
                            <th className="px-4 py-2.5" />
                          </tr>
                        </thead>
                        <tbody>
                          {day.transactions.map(tx => (
                            <TransactionRow key={tx.id} tx={tx} onDelete={onDeleteTransaction} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Menampilkan halaman {pagination.currentPage} dari {pagination.totalPages}
            {' '}({pagination.totalRecords} hari)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="chevron-left" className="w-4 h-4" />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  p === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-400'
                }`}>
                {p}
              </button>
            ))}
            <button
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="chevron-right" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
