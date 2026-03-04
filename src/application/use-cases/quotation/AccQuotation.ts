import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Quotation, AccQuotationDTO } from '@/src/domain/entities/Quotation';

export class AccQuotationUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  /**
   * ACC penawaran (Terkirim → ACC).
   * poNumber bersifat opsional.
   */
  async execute(dto: AccQuotationDTO): Promise<Quotation> {
    return this.repo.accQuotation(dto);
  }
}
