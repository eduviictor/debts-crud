import { GetDebtById } from '@/domain/usecases/get-debt-by-id';
import { UpdateDebt } from '@/domain/usecases/update-debt';
import { ObjectId } from 'mongodb';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { serverError, ok, badRequest, notFound } from '../helpers/http';
import { Controller } from '../protocols/controller';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { Validation } from '../protocols/validation';

export class UpdateDebtController implements Controller {
  constructor(
    private readonly getDebtById: GetDebtById,
    private readonly updateDebt: UpdateDebt,
    private readonly validation: Validation
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

      const debtExists = await this.getDebtById.getById(id);

      if (!debtExists) {
        return notFound('Id is not found');
      }

      if (body.date) {
        const error = this.validation.validate(request.body);

        if (error) {
          return badRequest(error);
        }
      }

      const debt = await this.updateDebt.update(id, body);

      return ok(debt);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
