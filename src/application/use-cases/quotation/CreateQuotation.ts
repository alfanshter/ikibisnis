import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Quotation, CreateQuotationDTO } from '@/src/domain/entities/Quotation';

export class CreateQuotationUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  async execute(dto: CreateQuotationDTO): Promise<Quotation> {
    return this.repo.createQuotation(dto);
  }
}
