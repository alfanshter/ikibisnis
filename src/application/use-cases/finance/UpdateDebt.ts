import { IDebtRepository } from '@/src/domain/repositories/IDebtRepository';
import { Debt, UpdateDebtDTO } from '@/src/domain/entities/Finance';

export class UpdateDebt {
  constructor(private repo: IDebtRepository) {}
  execute(id: string, dto: UpdateDebtDTO): Promise<Debt> {
    return this.repo.update(id, dto);
  }
}
