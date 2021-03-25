export const addDebtParamsSchema = {
  type: 'object',
  properties: {
    user_id: {
      type: 'number',
    },
    reason: {
      type: 'string',
    },
    amount: {
      type: 'string',
    },
    date: {
      type: 'string',
      example: 'yyyy-mm-dd',
    },
  },
  required: ['user_id', 'reason', 'amount', 'date'],
};
