/**
 * Organism: ProjectModal
 * Add / Edit project form modal.
 */
'use client';
import React, { useState } from 'react';
import {
  Project,
  ProjectCategory,
  ProjectPriority,
  ProjectItem,
  CreateProjectDTO,
  UpdateProjectDTO,
  calcProjectTotal,
  formatCurrency
} from '@/src/domain/entities/Project';
import { Icon } from '../atoms/Icon';

const CATEGORIES: ProjectCategory[] = [
  'Pengadaan Barang', 'Pengadaan Jasa', 'Pengadaan ATK',
  'Pengadaan Komputer', 'Pengadaan Furniture', 'Lainnya',
];
const PRIORITIES: ProjectPriority[] = ['Rendah', 'Sedang', 'Tinggi'];
const USERS = ['Alex Rivera', 'Sarah Chen', 'James Wilson', 'Maria Garcia', 'David Kim', 'Lisa Park', 'Tom Brown', 'Nina Patel'];

const EMPTY_ITEM: ProjectItem = { name: '', quantity: 1, unit: 'pcs', unitPrice: 0 };

interface Props {
  mode:    'add' | 'edit';
  project: Project | null;
  saving:  boolean;
  onClose:  () => void;
  onSubmit: (dto: CreateProjectDTO | UpdateProjectDTO) => Promise<void>;
}

interface FormErrors { [k: string]: string }

export const ProjectModal: React.FC<Props> = ({ mode, project, saving, onClose, onSubmit }) => {
  const [title,        setTitle]       = useState(project?.title        ?? '');
  const [description,  setDescription] = useState(project?.description  ?? '');
  const [category,     setCategory]    = useState<ProjectCategory>(project?.category ?? 'Pengadaan Barang');
  const [priority,     setPriority]    = useState<ProjectPriority>(project?.priority ?? 'Sedang');
  const [clientName,   setClientName]  = useState(project?.client.name  ?? '');
  const [clientContact,setClientContact] = useState(project?.client.contact ?? '');
  const [institution,  setInstitution] = useState(project?.client.institution ?? '');
  const [assignedTo,   setAssignedTo]  = useState(project?.assignedTo   ?? USERS[0]);
  const [deadline,     setDeadline]    = useState(
    project?.deadline
      ? new Date(project.deadline).toISOString().split('T')[0]
      : ''
  );
  const [items, setItems] = useState<ProjectItem[]>(
    project?.items && project.items.length > 0 ? project.items : [{ ...EMPTY_ITEM }]
  );
  const [notes,  setNotes]  = useState(project?.notes ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const totalValue = calcProjectTotal(items);

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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const dto = mode === 'add'
      ? ({
          title, description, category, priority,
          client: { name: clientName, contact: clientContact, institution: institution || undefined },
          items, assignedTo, deadline: new Date(deadline), notes: notes || undefined,
        } as CreateProjectDTO)
      : ({
          id: project!.id,
          title, description, category, priority,
          client: { name: clientName, contact: clientContact, institution: institution || undefined },
          items, assignedTo, deadline: new Date(deadline), notes: notes || undefined,
        } as UpdateProjectDTO);
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
                <select className={inputCls()} value={category} onChange={e => setCategory(e.target.value as ProjectCategory)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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
                <select className={inputCls()} value={priority} onChange={e => setPriority(e.target.value as ProjectPriority)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Ditugaskan ke</label>
                <select className={inputCls()} value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                  {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1.5">Deadline <span className="text-red-400">*</span></label>
                <input type="date" className={inputCls(errors.deadline)} value={deadline} onChange={e => setDeadline(e.target.value)} />
                {errors.deadline && <p className="text-red-400 text-xs mt-1">{errors.deadline}</p>}
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm font-medium">Item Pengadaan <span className="text-red-400">*</span></label>
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
