import { RequestUserById } from '@/domain/usecases/request-user-by-id';
import { UserRequest } from '../../protocols/request/user-request';

export class GetUserById implements RequestUserById {
  constructor(private readonly userRequest: UserRequest) {}

  async getById(id: number): Promise<any> {
    return await this.userRequest.getById(id);
  }
}
