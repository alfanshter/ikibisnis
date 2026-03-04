/**
 * Organism: QuotationModal
 * Create / Edit penawaran form modal.
 */
'use client';
import React, { useState } from 'react';
import {
  Quotation,
  QuotationItem,
  CreateQuotationDTO,
  UpdateQuotationDTO,
  calcQuotationTotal,
} from '@/src/domain/entities/Quotation';
import { ProjectCategory, ProjectPriority, formatCurrency } from '@/src/domain/entities/Project';
import { Icon } from '../atoms/Icon';

const CATEGORIES: ProjectCategory[] = [
  'Pengadaan Barang', 'Pengadaan Jasa', 'Pengadaan ATK',
  'Pengadaan Komputer', 'Pengadaan Furniture', 'Lainnya',
];
const PRIORITIES: ProjectPriority[] = ['Rendah', 'Sedang', 'Tinggi'];
const USERS = ['Alex Rivera', 'Sarah Chen', 'James Wilson', 'Maria Garcia', 'David Kim', 'Lisa Park', 'Tom Brown', 'Nina Patel'];
const EMPTY_ITEM: QuotationItem = { name: '', quantity: 1, unit: 'pcs', unitPrice: 0 };

interface Props {
  mode:      'create' | 'edit';
  quotation?: Quotation;
  saving:    boolean;
  onClose:   () => void;
  onSubmit:  (dto: CreateQuotationDTO | UpdateQuotationDTO) => Promise<void>;
}

interface FormErrors { title?: string; client?: string; items?: string; validUntil?: string; }

const inputCls = (err?: string) =>
  `w-full px-3 py-2 bg-slate-700/50 border ${err ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50`;

export const QuotationModal: React.FC<Props> = ({ mode, quotation, saving, onClose, onSubmit }) => {
  const [title,        setTitle]       = useState(quotation?.title        ?? '');
  const [description,  setDescription] = useState(quotation?.description  ?? '');
  const [category,     setCategory]    = useState<ProjectCategory>((quotation?.category as ProjectCategory) ?? 'Pengadaan Barang');
  const [priority,     setPriority]    = useState<ProjectPriority>((quotation?.priority as ProjectPriority) ?? 'Sedang');
  const [clientName,   setClientName]  = useState(quotation?.client.name       ?? '');
  const [clientContact,setClientContact] = useState(quotation?.client.contact  ?? '');
  const [institution,  setInstitution] = useState(quotation?.client.institution ?? '');
  const [assignedTo,   setAssignedTo]  = useState(quotation?.assignedTo        ?? USERS[0]);
  const [validUntil,   setValidUntil]  = useState(
    quotation?.validUntil
      ? new Date(quotation.validUntil).toISOString().split('T')[0]
      : ''
  );
  const [items, setItems] = useState<QuotationItem[]>(
    quotation?.items && quotation.items.length > 0 ? quotation.items : [{ ...EMPTY_ITEM }]
  );
  const [notes,  setNotes]  = useState(quotation?.notes ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const totalValue = calcQuotationTotal(items);

  const updateItem = (idx: number, field: keyof QuotationItem, value: string | number) =>
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: field === 'name' || field === 'unit' ? value : Number(value) } : it));
  const addItem    = () => setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!title.trim())      e.title    = 'Judul penawaran wajib diisi.';
    if (!clientName.trim()) e.client   = 'Nama klien wajib diisi.';
    if (!validUntil)        e.validUntil = 'Tanggal berlaku wajib diisi.';
    if (items.some(it => !it.name.trim() || it.unitPrice <= 0))
      e.items = 'Semua item harus memiliki nama dan harga.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const base = {
      title, description, category, priority,
      client: { name: clientName, contact: clientContact, institution: institution || undefined },
      items, assignedTo, validUntil: new Date(validUntil), notes: notes || undefined,
    };
    if (mode === 'edit' && quotation) {
      await onSubmit({ id: quotation.id, ...base });
    } else {
      await onSubmit(base as CreateQuotationDTO);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <Icon name="document" className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">
                {mode === 'create' ? 'Buat Penawaran Baru' : 'Edit Penawaran'}
              </h2>
              <p className="text-slate-400 text-xs">Penawaran (Quotation)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700/50">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">Judul Penawaran <span className="text-red-400">*</span></label>
            <input className={inputCls(errors.title)} value={title} onChange={e => setTitle(e.target.value)} placeholder="Penawaran Pengadaan..." />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">Deskripsi</label>
            <textarea className={inputCls()} rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi singkat..." />
          </div>

          {/* Kategori + Prioritas + Ditugaskan + Valid Hingga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Kategori</label>
              <select className={inputCls()} value={category} onChange={e => setCategory(e.target.value as ProjectCategory)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Prioritas</label>
              <select className={inputCls()} value={priority} onChange={e => setPriority(e.target.value as ProjectPriority)}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Ditugaskan ke</label>
              <select className={inputCls()} value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                {USERS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Berlaku Hingga <span className="text-red-400">*</span></label>
              <input type="date" className={inputCls(errors.validUntil)} value={validUntil} onChange={e => setValidUntil(e.target.value)} />
              {errors.validUntil && <p className="text-red-400 text-xs mt-1">{errors.validUntil}</p>}
            </div>
          </div>

          {/* Klien */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Nama Klien <span className="text-red-400">*</span></label>
              <input className={inputCls(errors.client)} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nama klien" />
              {errors.client && <p className="text-red-400 text-xs mt-1">{errors.client}</p>}
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Kontak</label>
              <input className={inputCls()} value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="HP / email" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Instansi</label>
              <input className={inputCls()} value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Instansi / perusahaan" />
            </div>
          </div>

          {/* Item Penawaran */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-sm">Item Penawaran <span className="text-red-400">*</span></label>
              <button type="button" onClick={addItem} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Icon name="plus" className="w-3.5 h-3.5" /> Tambah Item
              </button>
            </div>
            {errors.items && <p className="text-red-400 text-xs mb-2">{errors.items}</p>}
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <input className={inputCls()} placeholder="Nama item" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min={1} className={inputCls()} placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input className={inputCls()} placeholder="Satuan" value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} />
                  </div>
                  <div className="col-span-3">
                    <input type="number" min={0} className={inputCls()} placeholder="Harga satuan" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors">
                        <Icon name="x" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <span className="text-emerald-400 font-semibold text-sm">
                Total: {formatCurrency(totalValue)}
              </span>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-slate-300 text-sm mb-1.5">Catatan</label>
            <textarea className={inputCls()} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan tambahan..." />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-700/50 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            Batal
          </button>
          <button
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Icon name="loader" className="w-4 h-4 animate-spin" />}
            {mode === 'create' ? 'Buat Penawaran' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};
