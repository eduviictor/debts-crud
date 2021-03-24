import { ApiRequest } from '@/infra/protocols/api-request';
import axios from 'axios';

export class AxiosAdapter implements ApiRequest {
  constructor() {}

  async get(url: string, headers: any): Promise<any> {
    try {
      const response = await axios.get(url, { headers });

      return response.data;
    } catch (err) {
      if (err?.response?.status === 404) {
        return null;
      }
    }
  }
}
