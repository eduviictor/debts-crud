import { addDebtParamsSchema } from './schemas/add-debt-schema';
import { errorSchema } from './schemas/error-schema';
import { debtListSchema } from './schemas/debt-list-schema';
import { debtSchema } from './schemas/debt-schema';

export default {
  debt: debtSchema,
  debtList: debtListSchema,
  addDebtParams: addDebtParamsSchema,
  error: errorSchema,
};
