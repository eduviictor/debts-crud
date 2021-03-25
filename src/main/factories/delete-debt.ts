import { DebtMongoRepository } from '@/infra/db/debt-repository/debt';
import { DeleteDebtController } from '@/presentation/controllers/delete-debt';
import { Controller } from '@/presentation/protocols/controller';
import { DbDeleteDebt } from '@/services/usecases/db/db-delete-debt';
import { DbGetDebtById } from '@/services/usecases/db/db-get-debt-by-id';

export const makeDeleteDebtController = (): Controller => {
  const debtRepository = new DebtMongoRepository();
  const dbDeleteDebt = new DbDeleteDebt(debtRepository);
  const dbGetDebtById = new DbGetDebtById(debtRepository);

  return new DeleteDebtController(dbGetDebtById, dbDeleteDebt);
};
