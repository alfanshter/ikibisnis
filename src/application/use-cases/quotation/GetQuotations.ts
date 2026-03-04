import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { QuotationCollection } from '@/src/domain/entities/Quotation';

export class GetQuotationsUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  async execute(
    page: number,
    perPage: number,
    statusFilter?: string,
    search?: string
  ): Promise<QuotationCollection> {
    return this.repo.getQuotations(page, perPage, statusFilter, search);
  }
}
