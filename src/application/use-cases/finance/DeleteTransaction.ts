/**
 * Use Case: Delete Transaction
 */
import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';

export class DeleteTransactionUseCase {
  constructor(private repo: IFinanceRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error('ID transaksi wajib diisi.');
    return this.repo.deleteTransaction(id);
  }
}
