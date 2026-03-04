import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Quotation } from '@/src/domain/entities/Quotation';

export class SendQuotationUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  /** Ubah status Draft → Terkirim */
  async execute(id: string): Promise<Quotation> {
    return this.repo.sendQuotation(id);
  }
}
