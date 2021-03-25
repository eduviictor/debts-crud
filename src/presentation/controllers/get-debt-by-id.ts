import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import { ObjectId } from 'mongodb';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { serverError, ok, badRequest, notFound } from '../helpers/http';
import { Controller } from '../protocols/controller';
import { HttpResponse, HttpRequest } from '../protocols/http';

export class GetDebtByIdController implements Controller {
  constructor(private readonly getdebtById: GetDebtById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { id },
      } = request;

      if (!id) {
        return badRequest(new MissingParamError('id'));
      }

      if (!ObjectId.isValid(id)) {
        return badRequest(new InvalidParamError('id'));
      }

      const debt = await this.getdebtById.getById(id);

      if (!debt) {
        return notFound('Id is not found');
      }

      return ok(debt);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
