/**
 * Use Case: Get Cash Flow (Arus Kas)
 */
import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';
import { CashFlow } from '@/src/domain/entities/Finance';

export class GetCashFlowUseCase {
  constructor(private repo: IFinanceRepository) {}

  execute(period: string): Promise<CashFlow> {
    return this.repo.getCashFlow(period);
  }
}
