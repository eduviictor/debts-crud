import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import { UpdateDebt } from '@/domain/usecases/update-debt';
import { ObjectId } from 'mongodb';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { serverError, ok, badRequest, notFound } from '../helpers/http';
import { Controller } from '../protocols/controller';
import { HttpResponse, HttpRequest } from '../protocols/http';

export class UpdateDebtController implements Controller {
  constructor(
    private readonly getdebtById: GetDebtById,
    private readonly updateDebt: UpdateDebt
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { id },
        body,
      } = request;

      if (!id) {
        return badRequest(new MissingParamError('id'));
      }

      if (!ObjectId.isValid(id)) {
        return badRequest(new InvalidParamError('id'));
      }

      const debtExists = await this.getdebtById.getById(id);

      if (!debtExists) {
        return notFound('Id is not found');
      }

      const debt = await this.updateDebt.update(id, body);

      return ok(debt);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
