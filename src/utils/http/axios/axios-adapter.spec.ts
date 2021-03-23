import axios from 'axios';
import { AxiosAdapter } from './axios-adapter';

jest.mock('axios', () => ({
  async get(): Promise<any> {
    return await new Promise((resolve) =>
      resolve({
        data: 'success',
      })
    );
  },
}));

const makeSut = (): AxiosAdapter => new AxiosAdapter();

describe('Axios Adapter', () => {
  test('Should call axios with correct values', async () => {
    const sut = makeSut();
    const axiosSpy = jest.spyOn(axios, 'get');

    const url = 'any_url';
    const headers = {
      Authorization: 'any_authorization',
    };

    await sut.get(url, headers);

    expect(axiosSpy).toHaveBeenCalledWith(url, { headers });
  });

  test('Should return data on success', async () => {
    const sut = makeSut();

    const url = 'any_url';
    const headers = {
      Authorization: 'any_authorization',
    };

    const data = await sut.get(url, headers);

    expect(data).toBe('success');
  });

  test('Should throw if axios throws', async () => {
    const sut = makeSut();
    jest
      .spyOn(axios, 'get')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.get('any_url', { headers: {} });
    await expect(promise).rejects.toThrow();
  });
});
