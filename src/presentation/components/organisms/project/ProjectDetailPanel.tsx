/**
 * Organism: ProjectDetailPanel
 * Slide-in right panel showing full project details + quick status change.
 */
'use client';
import React from 'react';
import { Project, ProjectStatus, formatCurrency, calcOperationalCosts, calcMarketerFee } from '@/src/domain/entities/Project';
import { CategoryBadge } from '../../molecules/project/CategoryBadge';
import { ProjectStatusBadge } from '../../molecules/project/ProjectStatusBadge';
import { PriorityBadge } from '../../molecules/project/PriorityBadge';
import { Icon } from '../../atoms/Icon';

const STATUSES: ProjectStatus[] = ['Baru', 'Pending', 'Proses', 'Selesai', 'Dibayar', 'Dibatalkan'];

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  project: Project;
  saving:  boolean;
  onClose:        () => void;
  onEdit:         () => void;
  onStatusChange: (status: ProjectStatus) => void;
}

export const ProjectDetailPanel: React.FC<Props> = ({ project, saving, onClose, onEdit, onStatusChange }) => (  <aside className="w-96 shrink-0 bg-slate-800/80 border-l border-slate-700/50 flex flex-col h-full overflow-y-auto">
    {/* Header */}
    <div className="p-5 border-b border-slate-700/50 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-mono mb-1">{project.id}</p>
        <h2 className="text-white font-semibold text-sm leading-snug">{project.title}</h2>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-white shrink-0 p-1 rounded hover:bg-slate-700/50">
        <Icon name="x" className="w-5 h-5" />
      </button>
    </div>

    <div className="flex-1 p-5 space-y-5 overflow-y-auto">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <CategoryBadge category={project.category} />
        <ProjectStatusBadge status={project.status} />
        <PriorityBadge priority={project.priority} />
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
      )}

      {/* Client */}
      <Section title="Klien" icon="building">
        <Row label="Nama"     value={project.client.name} />
        <Row label="Kontak"   value={project.client.contact} />
        {project.client.institution && <Row label="Instansi" value={project.client.institution} />}
      </Section>

      {/* Marketing Eksternal */}
      {project.externalMarketer && (() => {
        const mkt = project.externalMarketer!;
        const fee = calcMarketerFee(project.totalValue, mkt);
        return (
          <Section title="Marketing Eksternal" icon="user">
            <Row label="Nama"    value={mkt.name} />
            {mkt.contact && <Row label="Kontak" value={mkt.contact} />}
            <Row
              label="Fee"
              value={mkt.feeType === 'percent'
                ? `${mkt.feePercent ?? 0}% = ${formatCurrency(fee)}`
                : formatCurrency(fee)}
            />
            {mkt.notes && <Row label="Catatan" value={mkt.notes} />}
            <p className="text-slate-600 text-xs pt-1">*tidak termasuk grand total</p>
          </Section>
        );
      })()}

      {/* Detail Proyek */}
      <Section title="Detail Proyek" icon="list">
        <Row label="Ditugaskan"   value={project.assignedTo} />
        <Row label="Dibuat"       value={fmt(project.createdAt)} />
        <Row label="Deadline"     value={fmt(project.deadline)} />
        {project.completedAt && <Row label="Selesai"   value={fmt(project.completedAt)} />}
        {project.poNumber    && <Row label="No. PO"    value={project.poNumber} />}
        <Row label="Asal"         value={project.origin === 'quotation' ? `Dari Penawaran${project.quotationId ? ` (${project.quotationId})` : ''}` : 'Langsung (Direct)'} />
      </Section>

      {/* Tipe Pembayaran */}
      <Section title="Tipe Pembayaran" icon="credit">
        <Row label="Tipe" value={project.billingType} />

        {/* Sewa */}
        {project.billingType === 'Sewa' && (
          <>
            {project.sewaStartDate && <Row label="Mulai Sewa"   value={fmt(project.sewaStartDate)} />}
            {project.sewaEndDate   && <Row label="Berakhir"     value={fmt(project.sewaEndDate)} />}
            {project.renewalMonths && <Row label="Perpanjangan" value={`${project.renewalMonths} bulan`} />}
          </>
        )}

        {/* Reguler / Sewa — info bayar */}
        {project.billingType !== 'Termin' && project.status === 'Dibayar' && (
          <>
            {project.paidAt        && <Row label="Tanggal Bayar"   value={fmt(project.paidAt)} />}
            {project.paymentMethod && <Row label="Metode Pembayaran" value={project.paymentMethod} />}
            {project.paymentNotes  && <Row label="Catatan Bayar"    value={project.paymentNotes} />}
          </>
        )}

        {/* Termin */}
        {project.billingType === 'Termin' && project.termins && project.termins.length > 0 && (
          <div className="mt-2 space-y-2">
            {project.termins.map((t) => (
              <div key={t.id} className="bg-slate-700/40 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs font-semibold">{t.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    t.status === 'Lunas'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : t.status === 'Jatuh Tempo'
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-slate-600/50 text-slate-400'
                  }`}>{t.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nominal</span>
                  <span className="text-white font-medium">{formatCurrency(t.amount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Jatuh Tempo</span>
                  <span className="text-slate-300">{fmt(t.dueDate)}</span>
                </div>
                {t.paidAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Dibayar</span>
                    <span className="text-emerald-400">{fmt(t.paidAt)}</span>
                  </div>
                )}
                {t.paymentMethod && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Metode</span>
                    <span className="text-slate-300">{t.paymentMethod}</span>
                  </div>
                )}
              </div>
            ))}
            {/* Ringkasan termin */}
            <div className="flex justify-between items-center bg-slate-700/30 rounded-lg px-3 py-2 text-xs mt-1">
              <span className="text-slate-400">Terbayar</span>
              <span className="text-emerald-400 font-semibold">
                {formatCurrency(project.termins.filter(t => t.status === 'Lunas').reduce((s, t) => s + t.amount, 0))}
                {' / '}
                <span className="text-slate-400">{formatCurrency(project.termins.reduce((s, t) => s + t.amount, 0))}</span>
              </span>
            </div>
          </div>
        )}
      </Section>

      {/* Item Pengadaan */}
      <Section title="Item Pengadaan" icon="package">
        <div className="space-y-2">
          {project.items.map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="text-white truncate">{item.name}</p>
                <p className="text-slate-500 text-xs">{item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}</p>
              </div>
              <span className="text-emerald-400 font-medium whitespace-nowrap shrink-0">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Subtotal + pajak & biaya */}
        <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className={`font-semibold ${project.additionalFees ? 'text-slate-300' : 'text-emerald-400 font-bold'}`}>
              {formatCurrency(project.totalValue)}
            </span>
          </div>

          <FeeBreakdown project={project} />
        </div>
        <OperasionalBreakdown project={project} />
      </Section>

      {/* Notes */}
      {project.notes && (
        <Section title="Catatan" icon="list">
          <p className="text-slate-400 text-sm leading-relaxed">{project.notes}</p>
        </Section>
      )}

      {/* Quick Status Change */}
      <Section title="Ubah Status" icon="check-circle">
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              disabled={project.status === s || saving}
              className={`py-2 rounded-lg text-xs font-medium transition-colors border
                ${project.status === s
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-300 cursor-default'
                  : 'border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700 hover:text-white'}
                disabled:opacity-50`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>
    </div>

    {/* Footer */}
    <div className="p-5 border-t border-slate-700/50 shrink-0">
      <button
        onClick={onEdit}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="edit" className="w-4 h-4" /> Edit Proyek
      </button>
    </div>
  </aside>
);

/* ── Fee Breakdown sub-component (PPN + PPH → masuk Grand Total) ── */
const FeeBreakdown: React.FC<{ project: Project }> = ({ project }) => {
  const f = project.additionalFees;
  if (!f) return null;
  if (!f.ppnRate && !f.pphEnabled) return null;

  const ppnAmt = f.ppnRate    ? (project.totalValue * f.ppnRate) / 100          : 0;
  const pphAmt = f.pphEnabled ? (project.totalValue * (f.pphRate ?? 0.5)) / 100 : 0;

  return (
    <>
      {f.ppnRate && (
        <div className="flex justify-between text-xs text-amber-400/80">
          <span>PPN {f.ppnRate}%</span>
          <span>+ {formatCurrency(ppnAmt)}</span>
        </div>
      )}
      {f.pphEnabled && (
        <div className="flex justify-between text-xs text-amber-400/80">
          <span>PPH {f.pphRate ?? 0.5}%</span>
          <span>+ {formatCurrency(pphAmt)}</span>
        </div>
      )}
      <div className="flex justify-between pt-1.5 border-t border-slate-700/40">
        <span className="text-slate-300 text-sm font-semibold">Grand Total</span>
        <span className="text-emerald-400 font-bold">{formatCurrency(project.grandTotal)}</span>
      </div>
    </>
  );
};

/* ── Operational Costs sub-component (E-Materai, Materai, E-Sign, Admin → TIDAK masuk Grand Total) ── */
const OperasionalBreakdown: React.FC<{ project: Project }> = ({ project }) => {
  const f = project.additionalFees;
  if (!f) return null;
  const hasOps = f.eMateraiEnabled || f.materaiEnabled || f.eSignEnabled || f.adminFeeEnabled;
  if (!hasOps) return null;

  const total = calcOperationalCosts(f);

  return (
    <div className="mt-3 pt-3 border-t border-slate-700/40 space-y-1.5">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Biaya Operasional</p>
      {f.eMateraiEnabled && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>E-Materai</span>
          <span>{formatCurrency(f.eMateraiAmount ?? 10_000)}</span>
        </div>
      )}
      {f.materaiEnabled && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>Materai</span>
          <span>{formatCurrency(f.materaiAmount ?? 10_000)}</span>
        </div>
      )}
      {f.eSignEnabled && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>E-Sign</span>
          <span>{formatCurrency(f.eSignAmount ?? 0)}</span>
        </div>
      )}
      {f.adminFeeEnabled && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>Biaya Admin{f.adminFeePlatform ? ` (${f.adminFeePlatform})` : ''}</span>
          <span>{formatCurrency(f.adminFeeAmount ?? 0)}</span>
        </div>
      )}
      <div className="flex justify-between text-xs font-semibold pt-1.5 border-t border-slate-700/30">
        <span className="text-orange-400/90">Total Operasional</span>
        <span className="text-orange-400/90">{formatCurrency(total)}</span>
      </div>
      <p className="text-slate-600 text-xs pt-1">*tidak termasuk grand total</p>
    </div>
  );
};

/* ── Helpers ── */
const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon name={icon} className="w-4 h-4 text-slate-500" />
      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
    </div>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start text-sm py-1 border-b border-slate-700/30 last:border-0">
    <span className="text-slate-500 shrink-0 mr-3">{label}</span>
    <span className="text-slate-200 text-right">{value}</span>
  </div>
);
