import { DebtModel } from '@/domain/models/debt';
import { AddDebt, AddDebtModel } from '@/domain/usecases/add-debt';
import { AddDebtRepository } from '../../protocols/db/db-add-debt-repository';

export class DbAddDebt implements AddDebt {
  constructor(private readonly addDebtRepository: AddDebtRepository) {}

  async add(debt: AddDebtModel): Promise<DebtModel> {
    const { user_id, amount, date, reason } = debt;

    const debtCreated = await this.addDebtRepository.add({
      user_id,
      amount,
      date,
      reason,
    });

    return debtCreated;
  }
}
