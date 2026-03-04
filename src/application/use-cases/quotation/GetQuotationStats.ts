import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { QuotationStats } from '@/src/domain/entities/Quotation';

export class GetQuotationStatsUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  async execute(): Promise<QuotationStats> {
    return this.repo.getQuotationStats();
  }
}
