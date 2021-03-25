import { DeleteDebtRepository } from '@/services/protocols/db/db-delete-debt-repository';
import { DbDeleteDebt } from './db-delete-debt';

const date = new Date();

const makeDeleteDebtRepository = (): DeleteDebtRepository => {
  class DeleteDebtStub implements DeleteDebtRepository {
    async delete(id: string): Promise<void> {}
  }

  return new DeleteDebtStub();
};

interface SutTypes {
  sut: DbDeleteDebt;
  getDebtByIdRepositoryStub: DeleteDebtRepository;
}

const makeSut = (): SutTypes => {
  const getDebtByIdRepositoryStub = makeDeleteDebtRepository();
  const sut = new DbDeleteDebt(getDebtByIdRepositoryStub);
  return {
    sut,
    getDebtByIdRepositoryStub,
  };
};

describe('DbDeleteDebt Usecase', () => {
  test('Should call DeleteDebtRepository', async () => {
    const { sut, getDebtByIdRepositoryStub } = makeSut();
    const getByIdSpy = jest.spyOn(getDebtByIdRepositoryStub, 'delete');

    await sut.delete('any_id');

    expect(getByIdSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw if DeleteDebtRepository throws', async () => {
    const { sut, getDebtByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getDebtByIdRepositoryStub, 'delete')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.delete('any_id');

    await expect(promise).rejects.toThrow();
  });
});
