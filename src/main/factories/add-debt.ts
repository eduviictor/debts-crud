import { DebtMongoRepository } from '@/infra/db/debt-repository/debt';
import { JsonPlaceHolderAdapter } from '@/infra/json-placeholder/json-placeholder-adapter';
import { AddDebtController } from '@/presentation/controllers/add-debt';
import { Controller } from '@/presentation/protocols/controller';
import { DbAddDebt } from '@/services/usecases/db/db-add-debt';
import { AxiosAdapter } from '@/utils/http/axios/axios-adapter';
import { makeAddDebtValidation } from './add-debt-validation';
import { GetUserById } from '@/services/usecases/request/get-user-by-id';

export const makeAdDebtController = (): Controller => {
  const axiosAdapter = new AxiosAdapter();
  const debtRepository = new DebtMongoRepository();
  const jsonPlaceHolder = new JsonPlaceHolderAdapter(axiosAdapter);
  const getUserById = new GetUserById(jsonPlaceHolder);
  const dbAddDet = new DbAddDebt(debtRepository);
  return new AddDebtController(getUserById, dbAddDet, makeAddDebtValidation());
};
