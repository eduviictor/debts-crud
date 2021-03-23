import { RequestUserById } from '@/domain/usecases/request-user-by-id';
import { UserRequest } from '../../protocols/request/user-request';
import { GetUserById } from './get-user-by-id';

const makeUserRequest = (): RequestUserById => {
  class UserRequestStub implements RequestUserById {
    async getById(): Promise<any> {
      const fakeUser = {
        id: 1,
        name: 'valid_name',
      };
      return await new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UserRequestStub();
};

interface SutTypes {
  sut: GetUserById;
  userRequestStub: UserRequest;
}

const makeSut = (): SutTypes => {
  const userRequestStub = makeUserRequest();
  const sut = new GetUserById(userRequestStub);
  return {
    sut,
    userRequestStub,
  };
};

describe('GetUserById Usecase', () => {
  test('Should call GetUserById', async () => {
    const { sut, userRequestStub } = makeSut();
    const getByIdSpy = jest.spyOn(userRequestStub, 'getById');

    await sut.getById(1);

    expect(getByIdSpy).toHaveBeenCalledTimes(1);
  });

  test('Should GetUserById return an user with success', async () => {
    const { sut } = makeSut();

    const user = await sut.getById(1);

    expect(user).toEqual({
      id: 1,
      name: 'valid_name',
    });
  });

  test('Should throw if UserRequest throws', async () => {
    const { sut, userRequestStub } = makeSut();
    jest
      .spyOn(userRequestStub, 'getById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.getById(1);

    await expect(promise).rejects.toThrow();
  });
});
