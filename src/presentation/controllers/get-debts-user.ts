import { GetDebtsByUser } from '@/domain/usecases/get-debts-by-user';
import { RequestUserById } from '@/domain/usecases/request-user-by-id';
import { MissingParamError } from '../errors/missing-param-error';
import { serverError, ok, badRequest, notFound } from '../helpers/http';
import { Controller } from '../protocols/controller';
import { HttpResponse, HttpRequest } from '../protocols/http';

export class GetDebtsUserController implements Controller {
  constructor(
    private readonly requestUserById: RequestUserById,
    private readonly getDebtsByUser: GetDebtsByUser
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { id },
      } = request;

      if (!id) {
        return badRequest(new MissingParamError('id'));
      }

      const user = await this.requestUserById.getById(id);

      if (!user) {
        return notFound('User not found');
      }

      const debts = await this.getDebtsByUser.getByUser(id);

      return ok(debts);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
