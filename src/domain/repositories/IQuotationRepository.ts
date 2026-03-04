/**
 * Repository Interface: IQuotationRepository
 * Contract for all quotation (penawaran) data operations.
 */

import {
  Quotation,
  QuotationCollection,
  QuotationStats,
  CreateQuotationDTO,
  UpdateQuotationDTO,
  AccQuotationDTO,
  RejectQuotationDTO,
} from '../entities/Quotation';
import { Project } from '../entities/Project';

export interface IQuotationRepository {
  /** Paginated list with optional status filter and search */
  getQuotations(
    page: number,
    perPage: number,
    statusFilter?: string,
    search?: string
  ): Promise<QuotationCollection>;

  getQuotationById(id: string): Promise<Quotation | null>;
  getQuotationStats(): Promise<QuotationStats>;

  createQuotation(dto: CreateQuotationDTO): Promise<Quotation>;
  updateQuotation(dto: UpdateQuotationDTO): Promise<Quotation>;

  /** Kirim penawaran ke klien (Draft → Terkirim) */
  sendQuotation(id: string): Promise<Quotation>;

  /** ACC penawaran — simpan poNumber opsional (Terkirim → ACC) */
  accQuotation(dto: AccQuotationDTO): Promise<Quotation>;

  /** Tolak penawaran (Terkirim → Ditolak) */
  rejectQuotation(dto: RejectQuotationDTO): Promise<Quotation>;

  /**
   * Konversi penawaran yang sudah ACC menjadi Project.
   * Status berubah ke 'Dikonversi' dan Project baru dibuat.
   * Returns: Project baru yang sudah tersimpan.
   */
  convertToProject(quotationId: string, deadline: Date): Promise<Project>;

  deleteQuotation(id: string): Promise<void>;
}
