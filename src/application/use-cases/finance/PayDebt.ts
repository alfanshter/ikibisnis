import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';
import { Debt, PayDebtDTO } from '@/src/domain/entities/Finance';

export class PayDebt {
  constructor(private repo: IDebtRepository) {}
  execute(id: string, dto: PayDebtDTO): Promise<Debt> {
    return this.repo.pay(id, dto);
  }
}
