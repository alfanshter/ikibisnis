/**
 * Molecule: TransactionRow
 * A single row inside the daily-report transaction list.
 */
'use client';
import React from 'react';
import { Transaction, formatCurrencyIdr, formatDateShort } from '@/src/domain/entities/Finance';
import { Icon } from '../atoms/Icon';

interface Props {
  tx: Transaction;
  onDelete?: (tx: Transaction) => void;
}

export const TransactionRow: React.FC<Props> = ({ tx, onDelete }) => {
  const isIn = tx.type === 'Pemasukan';
  return (
    <tr className="group border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3 text-slate-400 text-xs font-mono whitespace-nowrap">{formatDateShort(tx.date)}</td>
      <td className="px-4 py-3">
        <div>
          <p className="text-white text-sm leading-snug">{tx.description}</p>
          <p className="text-slate-500 text-xs">{tx.category}{tx.referenceNo ? ` · ${tx.referenceNo}` : ''}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
          ${isIn ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
          <Icon name={isIn ? 'trending-up' : 'trending-down'} className="w-3 h-3" />
          {tx.type}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-400 text-xs">{tx.paymentMethod}</td>
      <td className={`px-4 py-3 font-semibold text-sm text-right whitespace-nowrap ${isIn ? 'text-emerald-400' : 'text-red-400'}`}>
        {isIn ? '+' : '-'}{formatCurrencyIdr(tx.amount)}
      </td>
      <td className="px-4 py-3">
        {onDelete && (
          <button
            onClick={() => onDelete(tx)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
};
