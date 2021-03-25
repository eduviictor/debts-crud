import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAdDebtController } from '../factories/add-debt';
import { Router } from 'express';
import { makeGetDebtByIdController } from '../factories/get-debt-by-id';

export default (router: Router): void => {
  router.post('/debts', adaptRoute(makeAdDebtController()));
  router.get('/debts/:id', adaptRoute(makeGetDebtByIdController()));
};
