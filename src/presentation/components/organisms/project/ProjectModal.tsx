/**
 * Organism: ProjectModal
 * Add / Edit project form modal.
 */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Project,
  ProjectCategory,
  ProjectOrigin,
  ProjectPriority,
  ProjectBillingType,
  ProjectItem,
  ProjectAdditionalFees,
  PPNRate,
  ExternalMarketer,
  MarketerFeeType,
  CreateProjectDTO,
  UpdateProjectDTO,
  calcProjectTotal,
  calcGrandTotal,
  calcMarketerFee,
  formatCurrency,
} from '@/src/domain/entities/Project';
import { Icon } from '../../atoms/Icon';
import { apiFetch } from '@/src/infrastructure/api/apiFetch';

const BASE_PROJECTS = `/api/proxy/v1/projects`;

/* ─── ModalSelect ─────────────────────────────────────────────────────────── */
interface MSelectOption { value: string; label: string }
interface ModalSelectProps { value: string; options: MSelectOption[]; onChange: (v: string) => void; error?: boolean; }
const ModalSelect: React.FC<ModalSelectProps> = ({ value, options, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const selected = options.find(o => o.value === value);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen(p => !p);
  };

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between px-3 py-2.5 bg-slate-700/50 border rounded-lg text-sm transition-colors ${
          open ? 'border-blue-500/50' : error ? 'border-red-500/50' : 'border-slate-600/50 hover:border-slate-500/70'
        } ${selected ? 'text-white' : 'text-slate-500'}`}
      >
        <span className="truncate">{selected?.label ?? '-- Pilih --'}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl py-1 overflow-hidden"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center px-3 py-2.5 text-sm transition-all ${
                value === opt.value ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

/* ─── ModalDatePicker ─────────────────────────────────────────────────────── */
const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAYS_ID   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const ModalDatePicker: React.FC<{ value: string; onChange: (v: string) => void; error?: boolean }> = ({ value, onChange, error }) => {
  const [open,    setOpen]    = useState(false);
  const [pos,     setPos]     = useState({ top: 0, left: 0, width: 0 });
  const [showYearPicker, setShowYearPicker] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const today  = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear,  setViewYear]  = useState(parsed?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? today.getMonth());

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 280) });
    }
    setOpen(p => !p);
  };

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) { setOpen(false); setShowYearPicker(false); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false); setShowYearPicker(false);
  };

  const isSelected = (day: number) => parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day;
  const isToday    = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  const displayValue = () => parsed ? `${parsed.getDate()} ${MONTHS_ID[parsed.getMonth()].slice(0,3)} ${parsed.getFullYear()}` : null;
  const yearRange = Array.from({ length: 17 }, (_, i) => viewYear - 8 + i);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between px-3 py-2.5 bg-slate-700/50 border rounded-lg text-sm transition-colors ${
          open ? 'border-blue-500/50' : error ? 'border-red-500/50' : 'border-slate-600/50 hover:border-slate-500/70'
        } ${value ? 'text-white' : 'text-slate-500'}`}
      >
        <span>{displayValue() ?? 'Pilih tanggal'}</span>
        <Icon name="calendar" className="w-4 h-4 text-slate-500 shrink-0" />
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <button type="button" onClick={() => setShowYearPicker(p => !p)}
              className="flex items-center gap-1 text-sm font-semibold text-white hover:text-blue-400 transition-colors">
              {MONTHS_ID[viewMonth]} {viewYear}
              <Icon name={showYearPicker ? 'chevron-up' : 'chevron-down'} className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {!showYearPicker && (
              <div className="flex gap-1">
                <button type="button" onClick={prevMonth} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"><Icon name="chevron-left" className="w-4 h-4" /></button>
                <button type="button" onClick={nextMonth} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"><Icon name="chevron-right" className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          {showYearPicker ? (
            <div className="grid grid-cols-4 gap-1 px-3 pb-3">
              {yearRange.map(y => (
                <button key={y} type="button" onMouseDown={() => { setViewYear(y); setShowYearPicker(false); }}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    y === viewYear ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                  }`}>{y}</button>
              ))}
            </div>
          ) : (
            <div className="px-3 pb-3">
              <div className="grid grid-cols-7 mb-1">
                {DAYS_ID.map(d => <div key={d} className="text-center text-xs font-medium text-slate-500 py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {day !== null ? (
                      <button type="button" onClick={() => selectDay(day)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          isSelected(day) ? 'bg-blue-500 text-white'
                          : isToday(day)  ? 'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10'
                          : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                        }`}>{day}</button>
                    ) : <span />}
                  </div>
                ))}
              </div>
              {value && (
                <div className="pt-2 border-t border-slate-700/40 mt-2">
                  <button type="button" onClick={() => { onChange(''); setOpen(false); }}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors">Hapus tanggal</button>
                </div>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

const CATEGORIES: ProjectCategory[] = [
  'Pengadaan Barang', 'Pengadaan Jasa', 'Pengadaan ATK',
  'Pengadaan Komputer', 'Pengadaan Furniture', 'Lainnya',
];
const PRIORITIES: ProjectPriority[] = ['Rendah', 'Sedang', 'Tinggi'];

interface UserOption { id: string; fullName: string; }

const EMPTY_ITEM: ProjectItem = { name: '', quantity: 1, unit: 'pcs', unitPrice: 0 };

interface Props {
  mode:    'add' | 'edit';
  project: Project | null;
  saving:  boolean;
  onClose:  () => void;
  onSubmit: (dto: CreateProjectDTO | UpdateProjectDTO) => Promise<void>;
}

interface FormErrors { [k: string]: string }

/** Lokal — belum punya id/status/paidAt */
interface TerminForm {
  label:   string;
  amount:  number;
  dueDate: string; // 'YYYY-MM-DD'
  notes:   string;
}

const EMPTY_TERMIN: TerminForm = { label: '', amount: 0, dueDate: '', notes: '' };
const BILLING_TYPES: ProjectBillingType[] = ['Reguler', 'Termin', 'Sewa'];

export const ProjectModal: React.FC<Props> = ({ mode, project, saving, onClose, onSubmit }) => {
  const [title,        setTitle]       = useState(project?.title        ?? '');
  const [description,  setDescription] = useState(project?.description  ?? '');
  const [category,     setCategory]    = useState<ProjectCategory>(project?.category ?? 'Pengadaan Barang');
  const [priority,     setPriority]    = useState<ProjectPriority>(project?.priority ?? 'Sedang');
  const [clientName,   setClientName]  = useState(project?.client.name  ?? '');
  const [clientContact,setClientContact] = useState(project?.client.contact ?? '');
  const [institution,  setInstitution] = useState(project?.client.institution ?? '');

  // ── Users from API anyar ────────────────────────────────────────────────────────
  const [users,            setUsers]            = useState<UserOption[]>([]);
  const [assignedToUserId, setAssignedToUserId] = useState<string>(project?.assignedTo ?? '');

  useEffect(() => {
    apiFetch<{ data: UserOption[]; total: number }>(
      `/api/proxy/v1/users?limit=100&isActive=true`
    ).then(res => {
      const list = res.data ?? [];
      setUsers(list);
      // Pre-select first user if nothing is set yet
      if (!assignedToUserId && list.length > 0) {
        setAssignedToUserId(list[0].id);
      }
    }).catch(() => { /* silently ignore — won't break form */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [deadline,     setDeadline]    = useState(
    project?.deadline
      ? new Date(project.deadline).toISOString().split('T')[0]
      : ''
  );
  const [items, setItems] = useState<ProjectItem[]>(
    project?.items && project.items.length > 0 ? project.items : [{ ...EMPTY_ITEM }]
  );
  const [notes,  setNotes]  = useState(project?.notes ?? '');
  const [origin,   setOrigin]   = useState<ProjectOrigin>(project?.origin ?? 'direct');
  const [poNumber, setPoNumber] = useState(project?.poNumber ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Billing type state ───────────────────────────────────────────────────
  const [billingType, setBillingType] = useState<ProjectBillingType>(project?.billingType ?? 'Reguler');

  // Termin state
  const [termins, setTermins] = useState<TerminForm[]>(
    project?.termins && project.termins.length > 0
      ? project.termins.map(t => ({
          label:   t.label,
          amount:  t.amount,
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
          notes:   t.notes ?? '',
        }))
      : [{ ...EMPTY_TERMIN }]
  );

  // Sewa state
  const [sewaStartDate,  setSewaStartDate]  = useState(
    project?.sewaStartDate ? new Date(project.sewaStartDate).toISOString().split('T')[0] : ''
  );
  const [sewaEndDate,    setSewaEndDate]    = useState(
    project?.sewaEndDate ? new Date(project.sewaEndDate).toISOString().split('T')[0] : ''
  );
  const [renewalMonths,  setRenewalMonths]  = useState<number>(project?.renewalMonths ?? 12);

  // ── Additional fees state ────────────────────────────────────────────────
  const existFees = project?.additionalFees;
  const [ppnRate,         setPpnRate]         = useState<PPNRate | 0>(existFees?.ppnRate ?? 0);
  const [pphEnabled,      setPphEnabled]      = useState<boolean>(existFees?.pphEnabled ?? false);
  const [pphRate,         setPphRate]         = useState<number>(existFees?.pphRate ?? 0.5);
  const [eMateraiEnabled, setEMateraiEnabled] = useState<boolean>(existFees?.eMateraiEnabled ?? false);
  const [eMateraiAmount,  setEMateraiAmount]  = useState<number>(existFees?.eMateraiAmount ?? 10_000);
  const [materaiEnabled,  setMateraiEnabled]  = useState<boolean>(existFees?.materaiEnabled ?? false);
  const [materaiAmount,   setMateraiAmount]   = useState<number>(existFees?.materaiAmount ?? 10_000);
  const [eSignEnabled,    setESignEnabled]    = useState<boolean>(existFees?.eSignEnabled ?? false);
  const [eSignAmount,     setESignAmount]     = useState<number>(existFees?.eSignAmount ?? 0);
  const [adminFeeEnabled, setAdminFeeEnabled] = useState<boolean>(existFees?.adminFeeEnabled ?? false);
  const [adminFeeAmount,  setAdminFeeAmount]  = useState<number>(existFees?.adminFeeAmount ?? 0);
  const [adminFeePlatform,setAdminFeePlatform]= useState<string>(existFees?.adminFeePlatform ?? '');

  // ── External Marketer ──
  const existMkt = project?.externalMarketer;
  const [marketerEnabled,  setMarketerEnabled]  = useState<boolean>(!!existMkt);
  const [marketerName,     setMarketerName]      = useState<string>(existMkt?.name    ?? '');
  const [marketerContact,  setMarketerContact]   = useState<string>(existMkt?.contact ?? '');
  const [marketerFeeType,  setMarketerFeeType]   = useState<MarketerFeeType>(existMkt?.feeType ?? 'percent');
  const [marketerFeePercent, setMarketerFeePercent] = useState<number>(existMkt?.feePercent ?? 5);
  const [marketerFeeAmount,  setMarketerFeeAmount]  = useState<number>(existMkt?.feeAmount  ?? 0);
  const [marketerNotes,    setMarketerNotes]     = useState<string>(existMkt?.notes   ?? '');

  const totalValue = calcProjectTotal(items);

  /** Build additionalFees object — only include if at least one fee is active. */
  const buildAdditionalFees = (): ProjectAdditionalFees | undefined => {
    const anyActive = ppnRate !== 0 || pphEnabled || eMateraiEnabled || materaiEnabled || eSignEnabled || adminFeeEnabled;
    if (!anyActive) return undefined;
    return {
      ...(ppnRate !== 0    ? { ppnRate }                                                              : {}),
      ...(pphEnabled       ? { pphEnabled, pphRate }                                                  : {}),
      ...(eMateraiEnabled  ? { eMateraiEnabled, eMateraiAmount }                                      : {}),
      ...(materaiEnabled   ? { materaiEnabled, materaiAmount }                                        : {}),
      ...(eSignEnabled     ? { eSignEnabled, eSignAmount }                                            : {}),
      ...(adminFeeEnabled  ? { adminFeeEnabled, adminFeeAmount, adminFeePlatform: adminFeePlatform || undefined } : {}),
    };
  };

  /** Build externalMarketer object — only if marketer is enabled and has a name. */
  const buildMarketer = (): ExternalMarketer | undefined => {
    if (!marketerEnabled || !marketerName.trim()) return undefined;
    return {
      name:    marketerName.trim(),
      contact: marketerContact.trim() || undefined,
      feeType: marketerFeeType,
      ...(marketerFeeType === 'percent' ? { feePercent: marketerFeePercent } : { feeAmount: marketerFeeAmount }),
      notes:   marketerNotes.trim() || undefined,
    };
  };

  const grandTotal      = calcGrandTotal(totalValue, buildAdditionalFees());
  const marketerFeeCalc = calcMarketerFee(totalValue, buildMarketer());
  const ppnAmount  = ppnRate !== 0 ? (totalValue * ppnRate) / 100 : 0;
  const pphAmount  = pphEnabled    ? (totalValue * pphRate) / 100  : 0;


  const updateItem = (idx: number, field: keyof ProjectItem, value: string | number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: field === 'name' || field === 'unit' ? value : Number(value) } : it));
  };
  const addItem    = () => setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!title.trim())       e.title       = 'Judul wajib diisi.';
    if (!clientName.trim())  e.clientName  = 'Nama klien wajib diisi.';
    if (!deadline)           e.deadline    = 'Deadline wajib diisi.';
    if (items.length === 0)  e.items       = 'Minimal 1 item harus diisi.';
    items.forEach((it, i) => {
      if (!it.name.trim())   e[`item_name_${i}`]  = 'Nama item wajib.';
      if (it.unitPrice <= 0) e[`item_price_${i}`] = 'Harga harus > 0.';
    });
    // Termin validation
    if (billingType === 'Termin') {
      if (termins.length === 0) {
        e.termins = 'Minimal 1 termin harus diisi.';
      }
      termins.forEach((t, i) => {
        if (!t.label.trim())  e[`termin_label_${i}`]  = 'Nama termin wajib.';
        if (t.amount <= 0)    e[`termin_amount_${i}`] = 'Nominal harus > 0.';
        if (!t.dueDate)       e[`termin_due_${i}`]    = 'Jatuh tempo wajib diisi.';
      });
    }
    // Sewa validation
    if (billingType === 'Sewa') {
      if (!sewaStartDate) e.sewaStartDate = 'Tanggal mulai sewa wajib diisi.';
      if (!sewaEndDate)   e.sewaEndDate   = 'Tanggal berakhir sewa wajib diisi.';
      if (sewaStartDate && sewaEndDate && sewaEndDate <= sewaStartDate)
        e.sewaEndDate = 'Tanggal berakhir harus setelah tanggal mulai.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const baseFields = {
      title, description, category, priority,
      client: { name: clientName, contact: clientContact, institution: institution || undefined },
      items, assignedTo: assignedToUserId, deadline: new Date(deadline), notes: notes || undefined,
      assignedToUserId,
      poNumber: poNumber.trim() || undefined,
      billingType,
      ...(billingType === 'Termin' ? {
        termins: termins.map(t => ({
          label:   t.label,
          amount:  t.amount,
          dueDate: new Date(t.dueDate),
          notes:   t.notes || undefined,
        })),
      } : {}),
      ...(billingType === 'Sewa' ? {
        sewaStartDate:  new Date(sewaStartDate),
        sewaEndDate:    new Date(sewaEndDate),
        renewalMonths,
      } : {}),
      additionalFees: buildAdditionalFees(),
      externalMarketer: buildMarketer(),
    };
    const dto = mode === 'add'
      ? ({ ...baseFields, origin } as CreateProjectDTO)
      : ({ ...baseFields, id: project!.id } as UpdateProjectDTO);
    await onSubmit(dto);
  };

  const inputCls = (err?: string) =>
    `w-full bg-slate-700/50 border ${err ? 'border-red-500/50' : 'border-slate-600/50'} text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500/50 placeholder-slate-500`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icon name="briefcase" className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{mode === 'add' ? 'Tambah Proyek Baru' : 'Edit Proyek'}</h2>
              <p className="text-slate-400 text-xs">Isi detail proyek / pengadaan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/50">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Row 1: Title + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Judul Proyek <span className="text-red-400">*</span></label>
                <input className={inputCls(errors.title)} value={title} onChange={e => setTitle(e.target.value)} placeholder="Pengadaan…" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Kategori</label>
                <ModalSelect
                  value={category}
                  onChange={v => setCategory(v as ProjectCategory)}
                  options={CATEGORIES.map(c => ({ value: c, label: c }))}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Deskripsi</label>
              <textarea className={`${inputCls()} resize-none`} rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi singkat proyek…" />
            </div>

            {/* Row 2: Client Name + Contact + Institution */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Nama Klien <span className="text-red-400">*</span></label>
                <input className={inputCls(errors.clientName)} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="PT / CV / Instansi…" />
                {errors.clientName && <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Kontak</label>
                <input className={inputCls()} value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="No. HP / Email" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Instansi</label>
                <input className={inputCls()} value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Nama instansi (opsional)" />
              </div>
            </div>

            {/* Row 3: Priority + Assigned + Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Prioritas</label>
                <ModalSelect
                  value={priority}
                  onChange={v => setPriority(v as ProjectPriority)}
                  options={PRIORITIES.map(p => ({ value: p, label: p }))}
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Ditugaskan ke</label>
                {users.length === 0 ? (
                  <div className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-sm text-slate-500 animate-pulse">Memuat pengguna…</div>
                ) : (
                  <ModalSelect
                    value={assignedToUserId}
                    onChange={setAssignedToUserId}
                    options={users.map(u => ({ value: u.id, label: u.fullName }))}
                  />
                )}
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Deadline <span className="text-red-400">*</span></label>
                <ModalDatePicker value={deadline} onChange={setDeadline} error={!!errors.deadline} />
                {errors.deadline && <p className="text-red-400 text-xs mt-1">{errors.deadline}</p>}
              </div>
            </div>

            {/* ── Tipe Pembayaran ── */}
            <div className="bg-slate-700/20 border border-slate-700/50 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-violet-500/20 rounded flex items-center justify-center shrink-0">
                  <Icon name="credit" className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">Tipe Pembayaran</span>
              </div>

              {/* Billing type selector */}
              <div className="grid grid-cols-3 gap-2">
                {BILLING_TYPES.map(bt => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setBillingType(bt)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                      billingType === bt
                        ? bt === 'Termin'
                          ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
                          : bt === 'Sewa'
                          ? 'bg-blue-500/20 border-blue-500/60 text-blue-300'
                          : 'bg-slate-600 border-slate-500 text-white'
                        : 'bg-transparent border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <img
                      src={
                        bt === 'Termin' ? '/icons/icontermin.svg'
                        : bt === 'Sewa' ? '/icons/iconsewa.svg'
                        : '/icons/iconlangsungbayar.svg'
                      }
                      alt=""
                      className="w-4 h-4 shrink-0"
                    />
                    {bt === 'Termin' ? 'Termin' : bt === 'Sewa' ? 'Sewa' : 'Reguler'}
                  </button>
                ))}
              </div>

              {/* ── Termin builder ── */}
              {billingType === 'Termin' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-xs">Atur jadwal termin pembayaran</p>
                    <button
                      type="button"
                      onClick={() => setTermins(prev => [...prev, { ...EMPTY_TERMIN }])}
                      className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                    >
                      <Icon name="plus" className="w-3.5 h-3.5" /> Tambah Termin
                    </button>
                  </div>
                  {errors.termins && <p className="text-red-400 text-xs">{errors.termins}</p>}
                  {termins.map((t, i) => (
                    <div key={i} className="bg-slate-700/40 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-xs font-medium">Termin {i + 1}</span>
                        {termins.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setTermins(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Icon name="trash" className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            className={inputCls(errors[`termin_label_${i}`])}
                            placeholder="Nama (cth: DP 30%)"
                            value={t.label}
                            onChange={e => setTermins(prev => prev.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
                          />
                          {errors[`termin_label_${i}`] && <p className="text-red-400 text-xs mt-0.5">{errors[`termin_label_${i}`]}</p>}
                        </div>
                        <div>
                          <input
                            type="number"
                            min={0}
                            className={inputCls(errors[`termin_amount_${i}`])}
                            placeholder="Nominal (Rp)"
                            value={t.amount || ''}
                            onChange={e => setTermins(prev => prev.map((x, idx) => idx === i ? { ...x, amount: Number(e.target.value) } : x))}
                          />
                          {errors[`termin_amount_${i}`] && <p className="text-red-400 text-xs mt-0.5">{errors[`termin_amount_${i}`]}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-500 text-xs mb-1 block">Jatuh Tempo</label>
                          <ModalDatePicker
                            value={t.dueDate}
                            onChange={v => setTermins(prev => prev.map((x, idx) => idx === i ? { ...x, dueDate: v } : x))}
                            error={!!errors[`termin_due_${i}`]}
                          />
                          {errors[`termin_due_${i}`] && <p className="text-red-400 text-xs mt-0.5">{errors[`termin_due_${i}`]}</p>}
                        </div>
                        <div>
                          <label className="text-slate-500 text-xs mb-1 block">Catatan (opsional)</label>
                          <input
                            className={inputCls()}
                            placeholder="Catatan termin…"
                            value={t.notes}
                            onChange={e => setTermins(prev => prev.map((x, idx) => idx === i ? { ...x, notes: e.target.value } : x))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Total termin vs project */}
                  <div className="flex justify-between items-center bg-slate-700/30 rounded-lg px-3 py-2 text-xs">
                    <span className="text-slate-400">Total Termin:</span>
                    <span className={`font-semibold ${
                      termins.reduce((s, t) => s + t.amount, 0) === totalValue
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}>
                      {formatCurrency(termins.reduce((s, t) => s + t.amount, 0))}
                      {termins.reduce((s, t) => s + t.amount, 0) !== totalValue && (
                        <span className="ml-1 text-amber-500">≠ {formatCurrency(totalValue)}</span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* ── Sewa fields ── */}
              {billingType === 'Sewa' && (
                <div className="space-y-3">
                  <p className="text-slate-400 text-xs">Atur periode kontrak sewa</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Tanggal Mulai <span className="text-red-400">*</span></label>
                      <ModalDatePicker value={sewaStartDate} onChange={setSewaStartDate} error={!!errors.sewaStartDate} />
                      {errors.sewaStartDate && <p className="text-red-400 text-xs mt-0.5">{errors.sewaStartDate}</p>}
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Tanggal Berakhir <span className="text-red-400">*</span></label>
                      <ModalDatePicker value={sewaEndDate} onChange={setSewaEndDate} error={!!errors.sewaEndDate} />
                      {errors.sewaEndDate && <p className="text-red-400 text-xs mt-0.5">{errors.sewaEndDate}</p>}
                    </div>
                  </div>
                  <div className="w-40">
                    <label className="text-slate-400 text-xs mb-1 block">Periode Perpanjangan (bulan)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      className={inputCls()}
                      value={renewalMonths}
                      onChange={e => setRenewalMonths(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">                <label className="text-slate-300 text-sm font-medium">Item Pengadaan <span className="text-red-400">*</span></label>
                <button type="button" onClick={addItem} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                  <Icon name="plus" className="w-3.5 h-3.5" /> Tambah Item
                </button>
              </div>

              {errors.items && <p className="text-red-400 text-xs mb-2">{errors.items}</p>}

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-slate-700/30 rounded-lg p-3">
                    {/* Name */}
                    <div className="col-span-4">
                      <input
                        className={inputCls(errors[`item_name_${idx}`])}
                        placeholder="Nama item"
                        value={item.name}
                        onChange={e => updateItem(idx, 'name', e.target.value)}
                      />
                      {errors[`item_name_${idx}`] && <p className="text-red-400 text-xs mt-0.5">{errors[`item_name_${idx}`]}</p>}
                    </div>
                    {/* Qty */}
                    <div className="col-span-2">
                      <input type="number" min={1} className={inputCls()} placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
                    </div>
                    {/* Unit */}
                    <div className="col-span-2">
                      <input className={inputCls()} placeholder="Satuan" value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} />
                    </div>
                    {/* Price */}
                    <div className="col-span-3">
                      <input type="number" min={0} className={inputCls(errors[`item_price_${idx}`])} placeholder="Harga satuan" value={item.unitPrice || ''} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} />
                      {errors[`item_price_${idx}`] && <p className="text-red-400 text-xs mt-0.5">{errors[`item_price_${idx}`]}</p>}
                    </div>
                    {/* Remove */}
                    <div className="col-span-1 flex justify-center pt-2.5">
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 disabled:opacity-30" disabled={items.length === 1}>
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-3 flex justify-end">
                <div className="bg-slate-700/50 rounded-lg px-4 py-2 flex items-center gap-3">
                  <span className="text-slate-400 text-sm">Total Nilai:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>

            {/* ── Pajak & Biaya Tambahan ── */}
            <div className="bg-slate-700/20 border border-slate-700/50 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500/20 rounded flex items-center justify-center shrink-0">
                  <Icon name="list" className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">Pajak &amp; Biaya Tambahan</span>
                <span className="text-slate-500 text-xs">(opsional)</span>
              </div>

              {/* PPN */}
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">PPN</p>
                <div className="flex gap-2">
                  {([0, 11, 12] as const).map(rate => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPpnRate(rate as PPNRate | 0)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        ppnRate === rate
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                          : 'bg-transparent border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {rate === 0 ? 'Tidak dikenakan' : `PPN ${rate}%`}
                    </button>
                  ))}
                </div>
                {ppnRate !== 0 && (
                  <p className="text-amber-400/70 text-xs">
                    PPN {ppnRate}% = {formatCurrency(ppnAmount)}
                  </p>
                )}
              </div>

              {/* PPH */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">PPH</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pphEnabled}
                      onChange={e => setPphEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-500"
                    />
                    <span className="text-slate-400 text-xs">Dikenakan PPH</span>
                  </label>
                </div>
                {pphEnabled && (
                  <div className="flex items-center gap-3">
                    <div className="w-44">
                      <label className="text-slate-500 text-xs mb-1 block">Tarif PPH (%)</label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        className={inputCls()}
                        value={pphRate}
                        onChange={e => setPphRate(Number(e.target.value))}
                        placeholder="0.5"
                      />
                    </div>
                    <p className="text-amber-400/70 text-xs mt-4">
                      PPH {pphRate}% = {formatCurrency(pphAmount)}
                    </p>
                  </div>
                )}
              </div>

              {/* Biaya Lainnya */}
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Biaya Lainnya</p>
                <div className="space-y-2">
                  {/* E-Materai */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer w-36">
                      <input
                        type="checkbox"
                        checked={eMateraiEnabled}
                        onChange={e => setEMateraiEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 accent-blue-500"
                      />
                      <span className="text-slate-300 text-xs">E-Materai</span>
                    </label>
                    {eMateraiEnabled && (
                      <div className="w-44">
                        <input
                          type="number"
                          min={0}
                          className={inputCls()}
                          value={eMateraiAmount}
                          onChange={e => setEMateraiAmount(Number(e.target.value))}
                          placeholder="10000"
                        />
                      </div>
                    )}
                    {eMateraiEnabled && (
                      <span className="text-slate-400 text-xs">{formatCurrency(eMateraiAmount)}</span>
                    )}
                  </div>
                  {/* Materai */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer w-36">
                      <input
                        type="checkbox"
                        checked={materaiEnabled}
                        onChange={e => setMateraiEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 accent-blue-500"
                      />
                      <span className="text-slate-300 text-xs">Materai</span>
                    </label>
                    {materaiEnabled && (
                      <div className="w-44">
                        <input
                          type="number"
                          min={0}
                          className={inputCls()}
                          value={materaiAmount}
                          onChange={e => setMateraiAmount(Number(e.target.value))}
                          placeholder="10000"
                        />
                      </div>
                    )}
                    {materaiEnabled && (
                      <span className="text-slate-400 text-xs">{formatCurrency(materaiAmount)}</span>
                    )}
                  </div>
                  {/* E-Sign */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer w-36">
                      <input
                        type="checkbox"
                        checked={eSignEnabled}
                        onChange={e => setESignEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 accent-blue-500"
                      />
                      <span className="text-slate-300 text-xs">E-Sign</span>
                    </label>
                    {eSignEnabled && (
                      <div className="w-44">
                        <input
                          type="number"
                          min={0}
                          className={inputCls()}
                          value={eSignAmount}
                          onChange={e => setESignAmount(Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    )}
                    {eSignEnabled && (
                      <span className="text-slate-400 text-xs">{formatCurrency(eSignAmount)}</span>
                    )}
                  </div>
                  {/* Biaya Admin Platform */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer w-36">
                      <input
                        type="checkbox"
                        checked={adminFeeEnabled}
                        onChange={e => setAdminFeeEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 accent-blue-500"
                      />
                      <span className="text-slate-300 text-xs">Biaya Admin</span>
                    </label>
                    {adminFeeEnabled && (
                      <>
                        <div className="w-44">
                          <input
                            type="number"
                            min={0}
                            className={inputCls()}
                            value={adminFeeAmount}
                            onChange={e => setAdminFeeAmount(Number(e.target.value))}
                            placeholder="Nominal (Rp)"
                          />
                        </div>
                        <div className="w-36">
                          <input
                            className={inputCls()}
                            value={adminFeePlatform}
                            onChange={e => setAdminFeePlatform(e.target.value)}
                            placeholder="Platform (cth: Siplah)"
                          />
                        </div>
                        <span className="text-slate-400 text-xs">{formatCurrency(adminFeeAmount)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Grand Total preview — only show if any fee active */}
              {(ppnRate !== 0 || pphEnabled || eMateraiEnabled || materaiEnabled || eSignEnabled || adminFeeEnabled) && (
                <div className="mt-1 pt-3 border-t border-slate-700/50 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal Item</span>
                    <span>{formatCurrency(totalValue)}</span>
                  </div>
                  {ppnRate !== 0 && (
                    <div className="flex justify-between text-xs text-amber-400/80">
                      <span>PPN {ppnRate}%</span>
                      <span>+ {formatCurrency(ppnAmount)}</span>
                    </div>
                  )}
                  {pphEnabled && (
                    <div className="flex justify-between text-xs text-amber-400/80">
                      <span>PPH {pphRate}%</span>
                      <span>+ {formatCurrency(pphAmount)}</span>
                    </div>
                  )}
                  {(ppnRate !== 0 || pphEnabled) && (
                    <div className="flex justify-between text-sm font-semibold pt-1 border-t border-slate-700/40">
                      <span className="text-slate-200">Grand Total</span>
                      <span className="text-emerald-400">{formatCurrency(grandTotal)}</span>
                    </div>
                  )}
                  {/* Biaya operasional — tidak masuk grand total */}
                  {(eMateraiEnabled || materaiEnabled || eSignEnabled || adminFeeEnabled) && (
                    <div className="mt-2 pt-2 border-t border-slate-700/40 space-y-1">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Biaya Operasional <span className="normal-case font-normal">(tidak masuk grand total)</span>
                      </p>
                      {eMateraiEnabled && (
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>E-Materai</span>
                          <span>{formatCurrency(eMateraiAmount)}</span>
                        </div>
                      )}
                      {materaiEnabled && (
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Materai</span>
                          <span>{formatCurrency(materaiAmount)}</span>
                        </div>
                      )}
                      {eSignEnabled && (
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>E-Sign</span>
                          <span>{formatCurrency(eSignAmount)}</span>
                        </div>
                      )}
                      {adminFeeEnabled && (
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Biaya Admin{adminFeePlatform ? ` (${adminFeePlatform})` : ''}</span>
                          <span>{formatCurrency(adminFeeAmount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Marketing Eksternal ── */}
            <div className="bg-slate-700/20 border border-slate-700/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="user" className="w-4 h-4 text-purple-400" />
                  <p className="text-slate-300 text-sm font-semibold">Marketing Eksternal</p>
                  <span className="text-slate-500 text-xs font-normal">(opsional)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={marketerEnabled} onChange={e => setMarketerEnabled(e.target.checked)} />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500" />
                </label>
              </div>

              {marketerEnabled && (
                <div className="space-y-3 pt-1">
                  {/* Nama + Kontak */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Nama Marketer <span className="text-red-400">*</span></label>
                      <input
                        className={inputCls()}
                        value={marketerName}
                        onChange={e => setMarketerName(e.target.value)}
                        placeholder="Budi Santoso"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Kontak</label>
                      <input
                        className={inputCls()}
                        value={marketerContact}
                        onChange={e => setMarketerContact(e.target.value)}
                        placeholder="08123456789"
                      />
                    </div>
                  </div>

                  {/* Tipe Fee */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Tipe Fee Marketer</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMarketerFeeType('percent')}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          marketerFeeType === 'percent'
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-slate-700/40 border-slate-600/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        % Persentase
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarketerFeeType('flat')}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          marketerFeeType === 'flat'
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                            : 'bg-slate-700/40 border-slate-600/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Nominal Tetap
                      </button>
                    </div>
                  </div>

                  {/* Input Fee */}
                  {marketerFeeType === 'percent' ? (
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Persentase Fee (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0} max={100} step={0.5}
                          className={inputCls()}
                          value={marketerFeePercent}
                          onChange={e => setMarketerFeePercent(parseFloat(e.target.value) || 0)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                      </div>
                      {marketerFeePercent > 0 && totalValue > 0 && (
                        <p className="text-purple-400/80 text-xs mt-1">
                          = {formatCurrency((totalValue * marketerFeePercent) / 100)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-400 text-xs mb-1">Nominal Fee (Rp)</label>
                      <input
                        type="number"
                        min={0} step={1000}
                        className={inputCls()}
                        value={marketerFeeAmount}
                        onChange={e => setMarketerFeeAmount(parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  )}

                  {/* Catatan */}
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Catatan</label>
                    <input
                      className={inputCls()}
                      value={marketerNotes}
                      onChange={e => setMarketerNotes(e.target.value)}
                      placeholder="Referral dari pameran, dll."
                    />
                  </div>

                  {/* Preview fee */}
                  {marketerFeeCalc > 0 && (
                    <div className="flex justify-between text-xs pt-1.5 border-t border-slate-700/40">
                      <span className="text-slate-400">Fee Marketer yang harus dibayar</span>
                      <span className="text-purple-400 font-semibold">{formatCurrency(marketerFeeCalc)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Origin + PO Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === 'add' && (
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">Asal Proyek</label>
                  <ModalSelect
                    value={origin}
                    onChange={v => setOrigin(v as ProjectOrigin)}
                    options={[
                      { value: 'direct',    label: 'Langsung (Direct)' },
                      { value: 'quotation', label: 'Dari Penawaran (Quotation)' },
                    ]}
                  />
                  <p className="text-slate-500 text-xs mt-1">Untuk proyek dari penawaran, gunakan fitur Konversi di halaman Penawaran.</p>
                </div>
              )}
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">
                  Nomor PO <span className="text-slate-500 font-normal">(opsional)</span>
                </label>
                <input
                  className={inputCls()}
                  value={poNumber}
                  onChange={e => setPoNumber(e.target.value)}
                  placeholder="PO/KLIEN/2026/001"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Catatan</label>
              <textarea className={`${inputCls()} resize-none`} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan tambahan (opsional)…" />
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-700/50 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan…</>
              ) : (
                <><Icon name="check-circle" className="w-4 h-4" />{mode === 'add' ? 'Tambah Proyek' : 'Simpan Perubahan'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
