import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Quotation, UpdateQuotationDTO } from '@/src/domain/entities/Quotation';

export class UpdateQuotationUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  async execute(dto: UpdateQuotationDTO): Promise<Quotation> {
    return this.repo.updateQuotation(dto);
  }
}
