import axios from 'axios';
import { AxiosAdapter } from './axios-adapter';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

mockAxios.onGet().reply(200, 'success');

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

  test('Should return 404 if resource not found', async () => {
    const sut = makeSut();

    const url = 'any_url';
    const headers = {
      Authorization: 'any_authorization',
    };

    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet(url).replyOnce(404);

    const data = await sut.get(url, headers);

    expect(data).toBeNull();
  });
});
