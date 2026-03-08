import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';

export class DeleteDebt {
  constructor(private repo: IDebtRepository) {}
  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
