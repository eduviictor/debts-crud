import { debtsIdPath } from './paths/debts-id-path';
import { debtsPath } from './paths/debts-path';
import { debtsUsersPath } from './paths/debts-users-path';

export default {
  '/debts': debtsPath,
  '/debts/{id}': debtsIdPath,
  '/debts/users/{id}': debtsUsersPath,
};
