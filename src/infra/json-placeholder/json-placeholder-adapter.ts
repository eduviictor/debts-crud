import { UserRequest } from '@/services/protocols/request/user-request';
import { ApiRequest } from '../protocols/api-request';
import { UserResponse } from '../protocols/json-placeholder';
import { JsonPlaceHolderConfig } from './json-placeholder-config';

export class JsonPlaceHolderAdapter implements UserRequest {
  private readonly baseUrl = JsonPlaceHolderConfig.url;
  private readonly headersJsonPlaceHolder = JsonPlaceHolderConfig.headers;

  constructor(private readonly apiRequest: ApiRequest) {}

  async getById(id: number): Promise<UserResponse> {
    const user: UserResponse = await this.apiRequest.get(
      `${this.baseUrl}/users/${id}`,
      this.headersJsonPlaceHolder
    );

    if (!user) {
      return null;
    }

    return user;
  }
}
