/**
 * Organism: DeleteProjectModal
 * Confirmation dialog before deleting a project.
 */
'use client';
import React from 'react';
import { Project } from '@/src/domain/entities/Project';
import { Icon } from '../atoms/Icon';

interface Props {
  project:  Project;
  deleting: boolean;
  onConfirm: () => Promise<void>;
  onClose:   () => void;
}

export const DeleteProjectModal: React.FC<Props> = ({ project, deleting, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative z-10 bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md p-6">
      {/* Icon */}
      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <Icon name="trash" className="w-7 h-7 text-red-400" />
      </div>

      {/* Text */}
      <h2 className="text-white font-bold text-lg text-center mb-2">Hapus Proyek?</h2>
      <p className="text-slate-400 text-sm text-center mb-5">
        Tindakan ini tidak dapat dibatalkan. Data proyek berikut akan dihapus permanen.
      </p>

      {/* Project card */}
      <div className="bg-slate-700/50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <Icon name="briefcase" className="w-4 h-4 text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-medium text-sm leading-snug">{project.title}</p>
          <p className="text-slate-400 text-xs mt-0.5">{project.id} · {project.client.name}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {deleting
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menghapus…</>
            : <><Icon name="trash" className="w-4 h-4" /> Hapus Proyek</>
          }
        </button>
      </div>
    </div>
  </div>
);
