import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';
import { DebtSummary } from '@/src/domain/entities/Finance';

export class GetDebtSummary {
  constructor(private repo: IDebtRepository) {}
  execute(): Promise<DebtSummary> {
    return this.repo.getSummary();
  }
}
