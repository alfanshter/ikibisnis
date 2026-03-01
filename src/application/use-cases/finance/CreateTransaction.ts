/**
 * Use Case: Create Transaction
 */
import { IFinanceRepository } from '@/src/domain/repositories/IFinanceRepository';
import { Transaction, CreateTransactionDTO } from '@/src/domain/entities/Finance';

export class CreateTransactionUseCase {
  constructor(private repo: IFinanceRepository) {}

  async execute(dto: CreateTransactionDTO): Promise<Transaction> {
    if (!dto.description.trim()) throw new Error('Deskripsi transaksi wajib diisi.');
    if (dto.amount <= 0)         throw new Error('Jumlah transaksi harus lebih dari 0.');
    return this.repo.createTransaction(dto);
  }
}
