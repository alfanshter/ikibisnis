import { IQuotationRepository } from '@/src/domain/repositories/IQuotationRepository';
import { Project } from '@/src/domain/entities/Project';

export class ConvertToProjectUseCase {
  constructor(private readonly repo: IQuotationRepository) {}

  /**
   * Konversi penawaran ACC menjadi Project.
   * Status penawaran berubah ke 'Dikonversi'.
   * Returns: Project baru yang sudah tersimpan di store.
   */
  async execute(quotationId: string, deadline: Date): Promise<Project> {
    return this.repo.convertToProject(quotationId, deadline);
  }
}
