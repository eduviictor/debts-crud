import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAddDebtController } from '../factories/add-debt';
import { Router } from 'express';
import { makeGetDebtByIdController } from '../factories/get-debt-by-id';
import { makeGetDebtsByUserController } from '../factories/get-debts-by-user';
import { makeDeleteDebtController } from '../factories/delete-debt';
import { makeUpdateDebtController } from '../factories/update-debt';

export default (router: Router): void => {
  router.post('/debts', adaptRoute(makeAddDebtController()));
  router.get('/debts/:id', adaptRoute(makeGetDebtByIdController()));
  router.delete('/debts/:id', adaptRoute(makeDeleteDebtController()));
  router.put('/debts/:id', adaptRoute(makeUpdateDebtController()));
  router.get('/debts/clients/:id', adaptRoute(makeGetDebtsByUserController()));
};
