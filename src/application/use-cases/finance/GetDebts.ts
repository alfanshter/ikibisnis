import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';
import { DebtCollection, GetDebtsQuery } from '@/src/domain/entities/Finance';

export class GetDebts {
  constructor(private repo: IDebtRepository) {}
  execute(query: GetDebtsQuery): Promise<DebtCollection> {
    return this.repo.getAll(query);
  }
}
