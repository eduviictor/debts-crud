import { DebtModel } from '@/domain/models/debt';
import { AddDebtModel } from '@/domain/usecases/add-debt';

export interface AddDebtRepository {
  add: (planet: AddDebtModel) => Promise<DebtModel>;
}
