import { DebtModel } from '@/domain/models/debt';
import { UpdateDebt, UpdateDebtModel } from '@/domain/usecases/update-debt';
import { UpdateDebtRepository } from '@/services/protocols/db/db-update-debt-repository';

export class DbUpdateDebt implements UpdateDebt {
  constructor(private readonly updateDebtRepository: UpdateDebtRepository) {}

  async update(id: string, debt: UpdateDebtModel): Promise<DebtModel> {
    return await this.updateDebtRepository.update(id, debt);
  }
}
