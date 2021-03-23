import { ApiRequest } from '../protocols/api-request';
import { UserResponse } from '../protocols/json-placeholder';
import { JsonPlaceHolderAdapter } from './json-placeholder-adapter';
import { JsonPlaceHolderConfig } from './json-placeholder-config';

const makeApiRequest = (): ApiRequest => {
  class ApiRequestStub implements ApiRequest {
    async get(url: string, headers?: any): Promise<any> {
      const fakeResponse: UserResponse = {
        id: 1,
      };
      return await new Promise((resolve) => resolve(fakeResponse));
    }
  }
  return new ApiRequestStub();
};

interface SutTypes {
  sut: JsonPlaceHolderAdapter;
  apiRequestStub: ApiRequest;
}

const makeSut = (): SutTypes => {
  const apiRequestStub = makeApiRequest();
  const sut = new JsonPlaceHolderAdapter(apiRequestStub);
  return {
    sut,
    apiRequestStub,
  };
};

describe('JsonPlaceHolder Adapter', () => {
  test('Should JsonPlaceHolderAdapter call ApiRequest with correct values', async () => {
    const { sut, apiRequestStub } = makeSut();
    const apiRequestSpy = jest.spyOn(apiRequestStub, 'get');

    await sut.getById(1);
    const expectedUrl = `${JsonPlaceHolderConfig.url}/users/1`;

    expect(apiRequestSpy).toHaveBeenCalledWith(
      expectedUrl,
      JsonPlaceHolderConfig.headers
    );
  });

  test('Should JsonPlaceHolderAdapter returns null if user not found', async () => {
    const { sut, apiRequestStub } = makeSut();

    jest
      .spyOn(apiRequestStub, 'get')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)));

    const user = await sut.getById(99);
    expect(user).toBe(null);
  });

  test('Should JsonPlaceHolderAdapter returns a user on success', async () => {
    const { sut } = makeSut();

    const user = await sut.getById(1);
    expect(user.id).toBeTruthy();
  });
});
