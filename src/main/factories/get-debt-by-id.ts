import { DebtMongoRepository } from '@/infra/db/debt-repository/debt';
import { GetDebtByIdController } from '@/presentation/controllers/get-debt-by-id';
import { Controller } from '@/presentation/protocols/controller';
import { DbGetDebtById } from '@/services/usecases/db/db-get-debt-by-id';

export const makeGetDebtByIdController = (): Controller => {
  const debtRepository = new DebtMongoRepository();
  const dbGetDebtById = new DbGetDebtById(debtRepository);
  return new GetDebtByIdController(dbGetDebtById);
};
