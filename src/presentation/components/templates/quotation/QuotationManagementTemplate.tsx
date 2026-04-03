/**
 * Template: QuotationManagementTemplate
 * Menyusun semua organisms Penawaran menjadi halaman lengkap.
 * Pure presentation — menerima semua state + callback sebagai props.
 */
'use client';
import React from 'react';
import {
  Quotation,
  QuotationCollection,
  QuotationStats,
  CreateQuotationDTO,
  UpdateQuotationDTO,
  AccQuotationDTO,
  RejectQuotationDTO,
} from '@/src/domain/entities/Quotation';
import { formatCurrency } from '@/src/domain/entities/Project';
import { Sidebar }                   from '../../organisms/shared/Sidebar';
import { TopBar }                    from '../../organisms/shared/TopBar';
import { QuotationTable }            from '../../organisms/quotation/QuotationTable';
import { QuotationModal }            from '../../organisms/quotation/QuotationModal';
import { AccQuotationModal }         from '../../organisms/quotation/AccQuotationModal';
import { RejectQuotationModal }      from '../../organisms/quotation/RejectQuotationModal';
import { ConvertToProjectModal }     from '../../organisms/quotation/ConvertToProjectModal';
import { Icon }                      from '../../atoms/Icon';

/* ── Stats card kecil ── */
interface StatsCardProps {
  label:   string;
  value:   number | string;
  icon:    string;
  color:   'slate' | 'blue' | 'emerald' | 'red' | 'violet' | 'amber';
}

const COLOR_MAP: Record<StatsCardProps['color'], string> = {
  slate:   'bg-slate-500/10 border-slate-500/20 text-slate-400',
  blue:    'bg-blue-500/10  border-blue-500/20  text-blue-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  red:     'bg-red-500/10   border-red-500/20   text-red-400',
  violet:  'bg-violet-500/10 border-violet-500/20 text-violet-400',
  amber:   'bg-amber-500/10 border-amber-500/20 text-amber-400',
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
    <div className={`w-10 h-10 border rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[color]}`}>
      <Icon name={icon} className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-xs truncate">{label}</p>
      <p className="text-white text-lg font-bold leading-tight">{value}</p>
    </div>
  </div>
);

/* ── Delete confirm modal (generic) ── */
interface DeleteConfirmProps {
  quotation: Quotation;
  deleting:  boolean;
  onConfirm: () => Promise<void>;
  onClose:   () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmProps> = ({ quotation, deleting, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
          <Icon name="trash" className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Hapus Penawaran</h3>
          <p className="text-slate-400 text-xs">{quotation.id}</p>
        </div>
      </div>
      <p className="text-slate-300 text-sm">
        Yakin ingin menghapus penawaran <strong className="text-white">{quotation.title}</strong>?
        Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-2 text-sm text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {deleting && <Icon name="loader" className="w-4 h-4 animate-spin" />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   Template Props
══════════════════════════════════════════════════════════════════ */
export interface QuotationManagementTemplateProps {
  /* Data */
  collection:        QuotationCollection | null;
  stats:             QuotationStats | null;

  /* Flags */
  tableLoading:      boolean;
  modalSaving:       boolean;
  actionSaving:      boolean;
  deleting:          boolean;

  /* Modal state */
  showAddModal:        boolean;
  editingQuotation:    Quotation | null;
  deletingQuotation:   Quotation | null;
  accingQuotation:     Quotation | null;
  rejectingQuotation:  Quotation | null;
  convertingQuotation: Quotation | null;

  /* Filters */
  statusFilter: string;
  search:       string;
  page:         number;

  /* Callbacks */
  onPageChange:    (page: number) => void;
  onStatusFilter:  (v: string)    => void;
  onSearch:        (v: string)    => void;
  onOpenAddModal:  ()             => void;

  onEditQuotation:    (q: Quotation) => void;
  onDeleteQuotation:  (q: Quotation) => void;
  onSendQuotation:    (q: Quotation) => Promise<void>;
  onAccQuotation:     (q: Quotation) => void;
  onRejectQuotation:  (q: Quotation) => void;
  onConvertQuotation: (q: Quotation) => void;

  onCloseModal:    ()                                                    => void;
  onModalSubmit:   (dto: CreateQuotationDTO | UpdateQuotationDTO)        => Promise<void>;

  onAccSubmit:     (dto: AccQuotationDTO)    => Promise<void>;
  onAccClose:      ()                        => void;

  onRejectSubmit:  (dto: RejectQuotationDTO) => Promise<void>;
  onRejectClose:   ()                        => void;

  onConvertSubmit: (quotationId: string, deadline: Date)      => Promise<void>;
  onConvertClose:  ()                                         => void;

  onDeleteConfirm: ()                                         => Promise<void>;
  onDeleteClose:   ()                                         => void;
}

/* ══════════════════════════════════════════════════════════════════
   Template Component
══════════════════════════════════════════════════════════════════ */
export const QuotationManagementTemplate: React.FC<QuotationManagementTemplateProps> = ({
  collection, stats,
  tableLoading, modalSaving, actionSaving, deleting,
  showAddModal, editingQuotation, deletingQuotation,
  accingQuotation, rejectingQuotation, convertingQuotation,
  statusFilter, search,
  onPageChange, onStatusFilter, onSearch, onOpenAddModal,
  onEditQuotation, onDeleteQuotation, onSendQuotation,
  onAccQuotation, onRejectQuotation, onConvertQuotation,
  onCloseModal, onModalSubmit,
  onAccSubmit, onAccClose,
  onRejectSubmit, onRejectClose,
  onConvertSubmit, onConvertClose,
  onDeleteConfirm, onDeleteClose,
}) => (
  <div className="flex min-h-screen bg-slate-900">
    <Sidebar activePage="Projects" />

    <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pt-16 lg:pt-0">
      {/* ── Page Header ── */}
      <div className="px-8 pt-8 pb-0">
        <TopBar
          title="Penawaran"
          subtitle="Kelola penawaran proyek sebelum eksekusi"
          action={
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              <Icon name="plus" className="w-4 h-4" />
              Buat Penawaran
            </button>
          }
        />

        {/* ── Stats Bar ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
            <StatsCard label="Total Penawaran"  value={stats.total}              icon="document"    color="slate"   />
            <StatsCard label="Draft"            value={stats.draft}              icon="edit"        color="slate"   />
            <StatsCard label="Terkirim"         value={stats.terkirim}           icon="send"        color="blue"    />
            <StatsCard label="ACC"              value={stats.acc}                icon="thumb-up"    color="emerald" />
            <StatsCard label="Ditolak"          value={stats.ditolak}            icon="thumb-down"  color="red"     />
            <StatsCard label="Dikonversi"       value={stats.dikonversi}         icon="swap"        color="violet"  />
            <StatsCard label="Nilai ACC"        value={formatCurrency(stats.totalValueACC)}     icon="dollar"  color="emerald" />
            <StatsCard label="Nilai Pending"    value={formatCurrency(stats.totalValuePending)} icon="clock"   color="amber"   />
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="flex flex-1 px-8 pb-8">
        <div className="flex-1 min-w-0">
          <QuotationTable
            collection={collection}
            loading={tableLoading}
            statusFilter={statusFilter}
            search={search}
            onStatusFilter={onStatusFilter}
            onSearch={onSearch}
            onPageChange={onPageChange}
            onEdit={onEditQuotation}
            onDelete={onDeleteQuotation}
            onSend={onSendQuotation}
            onAcc={onAccQuotation}
            onReject={onRejectQuotation}
            onConvert={onConvertQuotation}
          />
        </div>
      </div>
    </main>

    {/* ═══ Modals ═══ */}

    {/* Create / Edit */}
    {(showAddModal || editingQuotation) && (
      <QuotationModal
        mode={showAddModal ? 'create' : 'edit'}
        quotation={editingQuotation ?? undefined}
        saving={modalSaving}
        onClose={onCloseModal}
        onSubmit={onModalSubmit}
      />
    )}

    {/* ACC */}
    {accingQuotation && (
      <AccQuotationModal
        quotation={accingQuotation}
        saving={actionSaving}
        onClose={onAccClose}
        onSubmit={onAccSubmit}
      />
    )}

    {/* Reject */}
    {rejectingQuotation && (
      <RejectQuotationModal
        quotation={rejectingQuotation}
        saving={actionSaving}
        onClose={onRejectClose}
        onSubmit={onRejectSubmit}
      />
    )}

    {/* Convert to Project */}
    {convertingQuotation && (
      <ConvertToProjectModal
        quotation={convertingQuotation}
        saving={actionSaving}
        onClose={onConvertClose}
        onSubmit={onConvertSubmit}
      />
    )}

    {/* Delete confirm */}
    {deletingQuotation && (
      <DeleteConfirmModal
        quotation={deletingQuotation}
        deleting={deleting}
        onConfirm={onDeleteConfirm}
        onClose={onDeleteClose}
      />
    )}
  </div>
);
