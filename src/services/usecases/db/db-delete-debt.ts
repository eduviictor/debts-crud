import { DebtModel } from '@/domain/models/debt';
import { DeleteDebt } from '@/domain/usecases/delete-debt';
import { DeleteDebtRepository } from '@/services/protocols/db/db-delete-debt-repository';

export class DbDeleteDebt implements DeleteDebt {
  constructor(private readonly deleteDebtRepository: DeleteDebtRepository) {}

  async delete(id: string): Promise<void> {
    await this.deleteDebtRepository.delete(id);
  }
}
