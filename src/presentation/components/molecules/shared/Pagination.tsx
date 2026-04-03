/**
 * Molecule Component: Pagination
 * Page navigation for user table
 */

import React from 'react';
import { Icon } from '../../atoms/Icon';

interface PaginationProps {
  page:         number;
  totalPages:   number;
  total:        number;
  limit:        number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, total, limit, onPageChange }) => {
  const currentPage = page;
  const start = (currentPage - 1) * limit + 1;
  const end   = Math.min(currentPage * limit, total);
  const totalUsers = total;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-slate-400 text-sm">
        Showing {start} to {end} of {totalUsers} users
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
        >
          <Icon name="chevron-left" className="w-3.5 h-3.5" />
          Prev
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
        >
          Next
          <Icon name="chevron-right" className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
