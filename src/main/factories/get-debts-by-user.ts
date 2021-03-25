import { DebtMongoRepository } from '@/infra/db/debt-repository/debt';
import { JsonPlaceHolderAdapter } from '@/infra/json-placeholder/json-placeholder-adapter';
import { GetDebtsUserController } from '@/presentation/controllers/get-debts-user';
import { Controller } from '@/presentation/protocols/controller';
import { DbGetDebtsByUser } from '@/services/usecases/db/db-get-debts-by-user';
import { GetUserById } from '@/services/usecases/request/get-user-by-id';
import { AxiosAdapter } from '@/utils/http/axios/axios-adapter';

export const makeGetDebtsByUserController = (): Controller => {
  const debtRepository = new DebtMongoRepository();
  const axiosAdapter = new AxiosAdapter();
  const jsonPlaceHolder = new JsonPlaceHolderAdapter(axiosAdapter);
  const getUserById = new GetUserById(jsonPlaceHolder);
  const dbGetDebtsByUser = new DbGetDebtsByUser(debtRepository);
  return new GetDebtsUserController(getUserById, dbGetDebtsByUser);
};
