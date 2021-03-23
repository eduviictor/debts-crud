import { RequestUserById } from '@/domain/usecases/request-user-by-id';
import { UserResponse } from '@/infra/protocols/json-placeholder';
import { UserRequest } from '../../protocols/request/user-request';

export class GetUserById implements RequestUserById {
  constructor(private readonly userRequest: UserRequest) {}

  async getById(id: number): Promise<UserResponse> {
    return await this.userRequest.getById(id);
  }
}
