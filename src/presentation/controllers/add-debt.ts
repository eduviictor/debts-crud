import { AddDebt } from '@/domain/usecases/add-debt';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest, serverError, ok } from '../helpers/http';
import { Controller } from '../protocols/controller';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { Validation } from '../protocols/validation';

export class AddDebtController implements Controller {
  constructor(
    private readonly addDebt: AddDebt,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['user_id', 'reason', 'date', 'amount'];

      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
      }

      const { user_id, reason, date, amount } = request.body;

      const debt = await this.addDebt.add({ user_id, reason, date, amount });

      return ok(debt);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
