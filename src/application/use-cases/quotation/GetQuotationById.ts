import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Quotation } from '@/src/domain/entities/Quotation';

export class GetQuotationByIdUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  async execute(id: string): Promise<Quotation | null> {
    return this.repo.getQuotationById(id);
  }
}
