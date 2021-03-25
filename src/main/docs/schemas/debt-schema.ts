export const debtSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
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
  required: ['id', 'user_id', 'reason', 'amount', 'date'],
};
