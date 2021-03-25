import { DebtMongoRepository } from '@/infra/db/debt-repository/debt';
import { UpdateDebtController } from '@/presentation/controllers/update-debt';
import { Controller } from '@/presentation/protocols/controller';
import { DbGetDebtById } from '@/services/usecases/db/db-get-debt-by-id';
import { DbUpdateDebt } from '@/services/usecases/db/db-update-debt';
import { makeUpdateDebtValidation } from './update-debt-validation';

export const makeUpdateDebtController = (): Controller => {
  const debtRepository = new DebtMongoRepository();
  const dbGetDebtById = new DbGetDebtById(debtRepository);
  const dbUpdateDebt = new DbUpdateDebt(debtRepository);
  return new UpdateDebtController(
    dbGetDebtById,
    dbUpdateDebt,
    makeUpdateDebtValidation()
  );
};
