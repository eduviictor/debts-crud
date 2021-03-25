export const debtListSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/debt',
  },
};
