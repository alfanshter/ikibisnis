import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';

export class DeleteQuotationUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  /** Hanya Draft yang bisa dihapus. */
  async execute(id: string): Promise<void> {
    return this.repo.deleteQuotation(id);
  }
}
