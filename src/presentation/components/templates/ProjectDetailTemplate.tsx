/**
 * Template: ProjectDetailTemplate
 * Full-page project detail view — opened when user clicks the 👁 (view) button.
 * Replaces the old slide-in ProjectDetailPanel approach.
 */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectStatus, Termin, PaymentMethod, formatCurrency, calcOperationalCosts, calcMarketerFee } from '@/src/domain/entities/Project';
import { Sidebar } from '../organisms/Sidebar';
import { TopBar } from '../organisms/TopBar';
import { Icon } from '../atoms/Icon';
import { CategoryBadge } from '../molecules/CategoryBadge';
import { ProjectStatusBadge } from '../molecules/ProjectStatusBadge';
import { PriorityBadge } from '../molecules/PriorityBadge';

const STATUSES: ProjectStatus[] = ['Baru', 'Proses', 'Selesai', 'Dibayar', 'Dibatalkan'];

const STATUS_COLOR: Record<ProjectStatus, string> = {
  Baru:       'bg-sky-500/10    border-sky-500/40    text-sky-300',
  Proses:     'bg-amber-500/10  border-amber-500/40  text-amber-300',
  Selesai:    'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
  Dibayar:    'bg-teal-500/10   border-teal-500/40   text-teal-300',
  Dibatalkan: 'bg-red-500/10    border-red-500/40    text-red-300',
};

export interface ProjectDetailTemplateProps {
  project:           Project;
  saving:            boolean;
  showPaymentModal:  boolean;
  showTerminModal:   boolean;
  selectedTermin:    Termin | null;
  onEdit:            () => void;
  onStatusChange:    (status: ProjectStatus) => void;
  onMarkAsPaid:      (method: PaymentMethod, notes?: string) => void;
  onClosePayModal:   () => void;
  onOpenTerminModal: (termin: Termin) => void;
  onPayTermin:       (method: PaymentMethod, notes?: string) => void;
  onCloseTerminModal: () => void;
}

export const ProjectDetailTemplate: React.FC<ProjectDetailTemplateProps> = ({
  project,
  saving,
  showPaymentModal,
  showTerminModal,
  selectedTermin,
  onEdit,
  onStatusChange,
  onMarkAsPaid,
  onClosePayModal,
  onOpenTerminModal,
  onPayTermin,
  onCloseTerminModal,
}) => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activePage="Projects" />

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="px-6 lg:px-10 pt-8 pb-12 max-w-5xl mx-auto">

          {/* ── Top Bar ── */}
          <TopBar
            title="Detail Proyek"
            subtitle={project.id}
            action={
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700/60 transition-all"
                >
                  <Icon name="chevron-left" className="w-4 h-4" />
                  Kembali
                </button>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  <Icon name="edit" className="w-4 h-4" />
                  Edit Proyek
                </button>
              </div>
            }
          />

          {/* ── Header Card ── */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-slate-500 text-xs font-mono mb-1">{project.id}</p>
                <h1 className="text-white text-2xl font-bold leading-tight mb-3">{project.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={project.category} />
                  <ProjectStatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                  {project.billingType !== 'Reguler' && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      project.billingType === 'Termin'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        : 'bg-blue-500/10   border-blue-500/30   text-blue-300'
                    }`}>
                      <Icon name="credit" className="w-3 h-3" />
                      {project.billingType === 'Termin' ? 'Pembayaran Termin' : 'Sewa Tahunan'}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-slate-500 text-xs mb-1">Total Nilai</p>
                <p className="text-emerald-400 text-2xl font-bold">{formatCurrency(project.totalValue)}</p>
                {project.additionalFees && (
                  <p className="text-slate-400 text-xs mt-0.5">
                    Grand Total: <span className="text-emerald-300 font-bold">{formatCurrency(project.grandTotal)}</span>
                  </p>
                )}
                {project.status === 'Dibayar' && (
                  <span className="inline-flex items-center gap-1 mt-1 text-teal-400 text-xs font-semibold">
                    <Icon name="check-circle" className="w-3.5 h-3.5" />
                    Sudah Dibayar
                  </span>
                )}
              </div>
            </div>
            {project.description && (
              <p className="text-slate-400 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-700/40">
                {project.description}
              </p>
            )}
          </div>

          {/* ── Two Column Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Left col: items table (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Items */}
              <Card title="Item Pengadaan" icon="package">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left text-slate-500 font-semibold pb-2 pr-4">Nama Item</th>
                        <th className="text-right text-slate-500 font-semibold pb-2 px-4">Qty</th>
                        <th className="text-right text-slate-500 font-semibold pb-2 px-4">Harga Satuan</th>
                        <th className="text-right text-slate-500 font-semibold pb-2 pl-4">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {project.items.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-700/10 transition-colors">
                          <td className="py-3 pr-4 text-white">{item.name}</td>
                          <td className="py-3 px-4 text-right text-slate-400">{item.quantity} {item.unit}</td>
                          <td className="py-3 px-4 text-right text-slate-400">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-3 pl-4 text-right text-emerald-400 font-medium">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-700/50">
                        <td colSpan={3} className="pt-3 text-slate-400 font-semibold">
                          {project.additionalFees ? 'Subtotal' : 'Total'}
                        </td>
                        <td className="pt-3 text-right text-emerald-400 font-bold text-base">
                          {formatCurrency(project.totalValue)}
                        </td>
                      </tr>
                      {project.additionalFees && (() => {
                        const f = project.additionalFees!;
                        const ppnAmt = f.ppnRate    ? (project.totalValue * f.ppnRate) / 100          : 0;
                        const pphAmt = f.pphEnabled ? (project.totalValue * (f.pphRate ?? 0.5)) / 100 : 0;
                        return (
                          <>
                            {f.ppnRate && (
                              <tr>
                                <td colSpan={3} className="pt-1.5 text-amber-400/80 text-xs">PPN {f.ppnRate}%</td>
                                <td className="pt-1.5 text-right text-amber-400/80 text-xs">+ {formatCurrency(ppnAmt)}</td>
                              </tr>
                            )}
                            {f.pphEnabled && (
                              <tr>
                                <td colSpan={3} className="pt-1.5 text-amber-400/80 text-xs">PPH {f.pphRate ?? 0.5}%</td>
                                <td className="pt-1.5 text-right text-amber-400/80 text-xs">+ {formatCurrency(pphAmt)}</td>
                              </tr>
                            )}
                            {(f.ppnRate || f.pphEnabled) && (
                              <tr className="border-t border-slate-700/50">
                                <td colSpan={3} className="pt-3 text-slate-200 font-bold">Grand Total</td>
                                <td className="pt-3 text-right text-emerald-400 font-bold text-base">
                                  {formatCurrency(project.grandTotal)}
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })()}
                    </tfoot>
                  </table>
                </div>
              </Card>

              {/* ── Biaya Operasional — hanya jika ada e-materai/materai/e-sign/admin fee ── */}
              {project.additionalFees && (() => {
                const f = project.additionalFees!;
                const hasOps = f.eMateraiEnabled || f.materaiEnabled || f.eSignEnabled || f.adminFeeEnabled;
                if (!hasOps) return null;
                const total = calcOperationalCosts(f);
                return (
                  <Card title="Biaya Operasional" icon="list">
                    <div className="space-y-2 mb-3">
                      {f.eMateraiEnabled && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">E-Materai</span>
                          <span className="text-slate-200 font-medium">{formatCurrency(f.eMateraiAmount ?? 10_000)}</span>
                        </div>
                      )}
                      {f.materaiEnabled && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Materai</span>
                          <span className="text-slate-200 font-medium">{formatCurrency(f.materaiAmount ?? 10_000)}</span>
                        </div>
                      )}
                      {f.eSignEnabled && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">E-Sign</span>
                          <span className="text-slate-200 font-medium">{formatCurrency(f.eSignAmount ?? 0)}</span>
                        </div>
                      )}
                      {f.adminFeeEnabled && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">
                            Biaya Admin{f.adminFeePlatform ? <span className="text-slate-500 ml-1">({f.adminFeePlatform})</span> : ''}
                          </span>
                          <span className="text-slate-200 font-medium">{formatCurrency(f.adminFeeAmount ?? 0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2.5 border-t border-slate-700/40">
                      <span className="text-slate-300">Total Operasional</span>
                      <span className="text-orange-400">{formatCurrency(total)}</span>
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-700/20 rounded-xl px-3 py-2.5 border border-slate-700/30">
                      <Icon name="info" className="w-4 h-4 shrink-0 text-orange-400/70 mt-0.5" />
                      <span>
                        Biaya operasional ini <strong className="text-slate-400">tidak termasuk</strong> dalam Grand Total proyek.
                        Dicatat sebagai pengeluaran internal untuk keperluan administrasi.
                      </span>
                    </div>
                  </Card>
                );
              })()}

              {/* Notes */}
              {project.notes && (
                <Card title="Catatan" icon="list">
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{project.notes}</p>
                </Card>
              )}

              {/* ── Termin table — only for Termin billing type ── */}
              {project.billingType === 'Termin' && project.termins && project.termins.length > 0 && (
                <Card title="Jadwal Pembayaran Termin" icon="credit">
                  {/* Progress bar */}
                  {(() => {
                    const paid  = project.termins!.filter(t => t.status === 'Lunas').length;
                    const total = project.termins!.length;
                    const pct   = Math.round((paid / total) * 100);
                    const paidAmt = project.termins!.filter(t => t.status === 'Lunas').reduce((s, t) => s + t.amount, 0);
                    return (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                          <span>{paid}/{total} termin lunas</span>
                          <span className="text-teal-400 font-semibold">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-xs mt-1.5">
                          <span className="text-slate-500">Terbayar</span>
                          <span className="text-teal-400 font-medium">{formatCurrency(paidAmt)} / {formatCurrency(project.totalValue)}</span>
                        </div>
                      </div>
                    );
                  })()}
                  <div className="space-y-2">
                    {project.termins.map(termin => {
                      const isOverdue = termin.status !== 'Lunas' && new Date(termin.dueDate) < new Date();
                      const statusColor =
                        termin.status === 'Lunas'          ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' :
                        isOverdue                          ? 'text-red-400  bg-red-500/10  border-red-500/20'  :
                                                             'text-amber-400 bg-amber-500/10 border-amber-500/20';
                      return (
                        <div key={termin.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-700/20 border border-slate-700/30 hover:bg-slate-700/30 transition-all">
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-medium truncate">{termin.label}</p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              Jatuh tempo: {new Date(termin.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {termin.paidAt && (
                                <span className="text-teal-500 ml-2">
                                  · Dibayar: {new Date(termin.paidAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  {termin.paymentMethod && ` via ${termin.paymentMethod}`}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(termin.amount)}</span>
                            {termin.status === 'Lunas' ? (
                              <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${statusColor}`}>Lunas</span>
                            ) : (
                              <button
                                onClick={() => onOpenTerminModal(termin)}
                                disabled={saving || project.status === 'Dibatalkan'}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20 transition-all disabled:opacity-50"
                              >
                                Bayar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-start gap-2 text-slate-400 text-xs">
                    <Icon name="info" className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                    Setiap termin yang dibayar akan otomatis dicatat sebagai <strong className="text-slate-300 ml-1">Pemasukan</strong> di Laporan Keuangan Harian.
                  </div>
                </Card>
              )}

              {/* ── Sewa info — only for Sewa billing type ── */}
              {project.billingType === 'Sewa' && (project.sewaStartDate || project.sewaEndDate) && (
                <Card title="Informasi Sewa / Langganan" icon="clock">
                  {project.sewaStartDate && (
                    <InfoRow
                      label="Mulai Sewa"
                      value={new Date(project.sewaStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    />
                  )}
                  {project.sewaEndDate && (
                    <InfoRow
                      label="Berakhir"
                      value={new Date(project.sewaEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    />
                  )}
                  {project.renewalMonths && (
                    <InfoRow label="Periode Perpanjangan" value={`${project.renewalMonths} bulan`} />
                  )}
                  {project.sewaEndDate && (() => {
                    const now2     = new Date();
                    const daysLeft = Math.ceil((new Date(project.sewaEndDate).getTime() - now2.getTime()) / 86_400_000);
                    const color    = daysLeft < 0 ? 'text-red-400' : daysLeft < 30 ? 'text-amber-400' : 'text-teal-400';
                    const msg      = daysLeft < 0 ? `Sudah berakhir ${Math.abs(daysLeft)} hari lalu` : `${daysLeft} hari lagi`;
                    return (
                      <div className={`mt-3 pt-3 border-t border-slate-700/30 flex items-center gap-2 text-xs font-semibold ${color}`}>
                        <Icon name="clock" className="w-4 h-4" />
                        {msg}
                      </div>
                    );
                  })()}
                </Card>
              )}

              {/* Payment info — only shown when paid (Reguler/Sewa) */}
              {project.status === 'Dibayar' && project.paidAt && project.billingType !== 'Termin' && (
                <Card title="Informasi Pembayaran" icon="credit">
                  <InfoRow
                    label="Tanggal Bayar"
                    value={new Date(project.paidAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                  <InfoRow label="Metode" value={project.paymentMethod ?? '-'} />
                  {project.paymentNotes && (
                    <InfoRow label="Catatan" value={project.paymentNotes} />
                  )}
                  <div className="mt-3 pt-3 border-t border-teal-700/30 flex items-center gap-2 text-teal-400 text-xs font-semibold">
                    <Icon name="check-circle" className="w-4 h-4" />
                    Transaksi otomatis dicatat ke Laporan Keuangan Harian
                  </div>
                </Card>
              )}
            </div>

            {/* Right col: meta + client + status (1/3 width) */}
            <div className="space-y-6">

              {/* Client */}
              <Card title="Informasi Klien" icon="building">
                <InfoRow label="Nama"     value={project.client.name} />
                <InfoRow label="Kontak"   value={project.client.contact} />
                {project.client.institution && (
                  <InfoRow label="Instansi" value={project.client.institution} />
                )}
              </Card>

              {/* Marketing Eksternal */}
              {project.externalMarketer && (
                <Card title="Marketing Eksternal" icon="user">
                  <InfoRow label="Nama"    value={project.externalMarketer.name} />
                  {project.externalMarketer.contact && (
                    <InfoRow label="Kontak" value={project.externalMarketer.contact} />
                  )}
                  <InfoRow
                    label="Tipe Fee"
                    value={project.externalMarketer.feeType === 'percent'
                      ? `${project.externalMarketer.feePercent ?? 0}%`
                      : 'Nominal Tetap'}
                  />
                  <div className="flex justify-between items-center text-sm py-1 border-b border-slate-700/30">
                    <span className="text-slate-500 shrink-0 mr-3">Fee</span>
                    <span className="text-purple-400 font-semibold text-right">
                      {formatCurrency(calcMarketerFee(project.totalValue, project.externalMarketer))}
                    </span>
                  </div>
                  {project.externalMarketer.notes && (
                    <InfoRow label="Catatan" value={project.externalMarketer.notes} />
                  )}
                  <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-700/20 rounded-xl px-3 py-2.5 border border-slate-700/30">
                    <Icon name="info" className="w-4 h-4 shrink-0 text-purple-400/70 mt-0.5" />
                    <span>Fee marketer <strong className="text-slate-400">tidak termasuk</strong> grand total. Catat secara manual sebagai pengeluaran.</span>
                  </div>
                </Card>
              )}

              {/* Timeline */}
              <Card title="Timeline" icon="clock">
                <InfoRow
                  label="Dibuat"
                  value={new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                />
                <InfoRow
                  label="Deadline"
                  value={new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                />
                {project.completedAt && (
                  <InfoRow
                    label="Selesai"
                    value={new Date(project.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                )}
                {project.paidAt && (
                  <InfoRow
                    label="Dibayar"
                    value={new Date(project.paidAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                )}
                <InfoRow label="Ditugaskan ke" value={project.assignedTo} />
              </Card>

              {/* Status Change */}
              <Card title="Ubah Status" icon="check-circle">
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(s)}
                      disabled={project.status === s || saving || project.status === 'Dibayar'}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                        project.status === s
                          ? STATUS_COLOR[s] + ' cursor-default'
                          : 'border-slate-700/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer'
                      } ${s === 'Dibayar' && project.status !== 'Dibayar' ? 'col-span-2 border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20' : ''}`}
                    >
                      {saving && project.status !== s ? (
                        <span className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          {s === 'Dibayar' && project.status !== 'Dibayar' && (
                            <Icon name="credit" className="w-3.5 h-3.5" />
                          )}
                          {s}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {project.status === 'Dibayar' && (
                  <p className="text-teal-400/70 text-xs mt-3 text-center">
                    Proyek ini sudah ditandai sebagai dibayar.
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* ── Payment Modal ── */}
      {showPaymentModal && (
        <PaymentModal
          project={project}
          saving={saving}
          onClose={onClosePayModal}
          onConfirm={onMarkAsPaid}
        />
      )}

      {/* ── Termin Payment Modal ── */}
      {showTerminModal && selectedTermin && (
        <TerminPayModal
          termin={selectedTermin}
          saving={saving}
          onClose={onCloseTerminModal}
          onConfirm={onPayTermin}
        />
      )}
    </div>
  );
};

/* ── Payment Modal ─────────────────────────────────────────────────────────── */
const PAYMENT_METHODS: PaymentMethod[] = ['Transfer Bank', 'Tunai', 'QRIS', 'Cek/Giro'];

const PaymentModal: React.FC<{
  project: Project;
  saving:  boolean;
  onClose:   () => void;
  onConfirm: (method: PaymentMethod, notes?: string) => void;
}> = ({ project, saving, onClose, onConfirm }) => {
  const [method, setMethod] = useState<PaymentMethod>('Transfer Bank');
  const [notes,  setNotes]  = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center">
              <Icon name="credit" className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Tandai Dibayar</h2>
              <p className="text-slate-400 text-xs">{project.id} · {formatCurrency(project.totalValue)}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-all">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Info */}
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3">
            <p className="text-teal-300 text-sm leading-relaxed">
              Menandai proyek ini sebagai <strong>Dibayar</strong> akan otomatis membuat entri
              <strong> Pemasukan</strong> sebesar <strong>{formatCurrency(project.totalValue)}</strong> di Laporan Keuangan Harian.
            </p>
          </div>

          {/* Metode pembayaran */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Metode Pembayaran <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left ${
                    method === m
                      ? 'bg-teal-500/15 border-teal-500/50 text-teal-300'
                      : 'bg-slate-700/40 border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Nomor referensi, nama pengirim, dll."
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-teal-500/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 text-sm font-medium transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(method, notes.trim() || undefined)}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Icon name="check-circle" className="w-4 h-4" />
                Konfirmasi Pembayaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Termin Payment Modal ──────────────────────────────────────────────────── */
const TerminPayModal: React.FC<{
  termin:    Termin;
  saving:    boolean;
  onClose:   () => void;
  onConfirm: (method: PaymentMethod, notes?: string) => void;
}> = ({ termin, saving, onClose, onConfirm }) => {
  const [method, setMethod] = useState<PaymentMethod>('Transfer Bank');
  const [notes,  setNotes]  = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center">
              <Icon name="credit" className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Bayar Termin</h2>
              <p className="text-slate-400 text-xs">{termin.label} · {formatCurrency(termin.amount)}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-all">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3">
            <p className="text-teal-300 text-sm leading-relaxed">
              Pembayaran termin <strong>{termin.label}</strong> sebesar <strong>{formatCurrency(termin.amount)}</strong> akan
              otomatis dicatat sebagai <strong>Pemasukan</strong> di Laporan Keuangan Harian.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1.5">
              Metode Pembayaran <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Transfer Bank', 'Tunai', 'QRIS', 'Cek/Giro'] as PaymentMethod[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all text-left ${
                    method === m
                      ? 'bg-teal-500/15 border-teal-500/50 text-teal-300'
                      : 'bg-slate-700/40 border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1.5">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Nomor referensi, nama pengirim, dll."
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-teal-500/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 text-sm font-medium transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(method, notes.trim() || undefined)}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Icon name="check-circle" className="w-4 h-4" />
                Konfirmasi Pembayaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Internal helpers ── */
const Card: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon name={icon} className="w-4 h-4 text-slate-500" />
      <h3 className="text-slate-300 text-xs font-bold uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start text-sm py-2 border-b border-slate-700/30 last:border-0 gap-3">
    <span className="text-slate-500 shrink-0">{label}</span>
    <span className="text-slate-200 text-right break-all">{value}</span>
  </div>
);
