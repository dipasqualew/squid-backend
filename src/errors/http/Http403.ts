import { BaseError } from '../BaseError';

export class Http403 extends BaseError {
  public static statusCode = 403;

  constructor(resource: string, identifier: string, user_uuid = '[Anonymous]') {
    const message = `${user_uuid} is not Authorized to access ${resource}: '${identifier}.'`;
    super(message, ['Not Authorized']);
  }
}
