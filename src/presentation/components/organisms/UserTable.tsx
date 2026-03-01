/**
 * Organism Component: UserTable
 * Full user table with header, rows, and pagination
 */

import React from 'react';
import { User, UserCollection } from '@/src/domain/entities/User';
import { UserTableRow } from '../molecules/UserTableRow';
import { Pagination } from '../molecules/Pagination';

interface UserTableProps {
  userCollection: UserCollection;
  onEdit:       (user: User) => void;
  onDelete:     (user: User) => void;
  onPageChange: (page: number) => void;
  loading?:     boolean;
}

const TABLE_HEADERS = ['USER', 'ROLE', 'STATUS', 'LAST LOGIN', 'ACTIONS'];

export const UserTable: React.FC<UserTableProps> = ({
  userCollection,
  onEdit,
  onDelete,
  onPageChange,
  loading = false
}) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            {TABLE_HEADERS.map(h => (
              <th
                key={h}
                className="px-6 py-4 text-left text-xs font-semibold text-slate-500 tracking-widest uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-slate-700/50">
                {TABLE_HEADERS.map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : userCollection.users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                No users found
              </td>
            </tr>
          ) : (
            userCollection.users.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="border-t border-slate-700/50 px-4">
      <Pagination
        pagination={userCollection.pagination}
        onPageChange={onPageChange}
      />
    </div>
  </div>
);
