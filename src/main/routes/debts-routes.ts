import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAdDebtController } from '../factories/add-debt';
import { Router } from 'express';

export default (router: Router): void => {
  router.post('/debts', adaptRoute(makeAdDebtController()));
};
