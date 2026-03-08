/**
 * Use Case: Pay Termin
 * Marks a single termin installment as paid and auto-records a finance transaction.
 */
import { IProjectRepository } from '@/src/domain/repositories/IProjectRepository';
import { Project, PayTerminDTO } from '@/src/domain/entities/Project';

export class PayTerminUseCase {
  constructor(private repo: IProjectRepository) {}

  async execute(dto: PayTerminDTO): Promise<Project> {
    if (!dto.projectId) throw new Error('Project ID wajib diisi.');
    if (!dto.terminId)  throw new Error('Termin ID wajib diisi.');
    return this.repo.payTermin(dto);
  }
}
