import { DebtModel } from '@/domain/models/debt';
import { UpdateDebtModel } from '@/domain/usecases/update-debt';

export interface UpdateDebtRepository {
  update: (id: string, debt: UpdateDebtModel) => Promise<DebtModel>;
}
