import { AddDebt } from '@/domain/usecases/add-debt';
import { RequestUserById } from '@/domain/usecases/request-user-by-id';
import { badRequest, serverError, ok, notFound } from '../helpers/http';
import { Controller } from '../protocols/controller';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { Validation } from '../protocols/validation';

export class AddDebtController implements Controller {
  constructor(
    private readonly requestUserById: RequestUserById,
    private readonly addDebt: AddDebt,
    private readonly validation: Validation
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);

      if (error) {
        return badRequest(error);
      }

      const { user_id, reason, date, amount } = request.body;

      const user = await this.requestUserById.getById(user_id);

      if (!user) {
        return notFound('User not found');
      }

      const debt = await this.addDebt.add({ user_id, reason, date, amount });

      return ok(debt);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
