import { UserResponse } from '@/infra/protocols/json-placeholder';
export interface UserRequest {
  getById: (id: number) => Promise<UserResponse>;
}
