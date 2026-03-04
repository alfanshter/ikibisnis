import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Quotation, RejectQuotationDTO } from '@/src/domain/entities/Quotation';

export class RejectQuotationUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  /** Tolak penawaran (Terkirim → Ditolak) */
  async execute(dto: RejectQuotationDTO): Promise<Quotation> {
    return this.repo.rejectQuotation(dto);
  }
}
