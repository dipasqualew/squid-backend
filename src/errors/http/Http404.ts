import { BaseError } from '../BaseError';

export class Http404 extends BaseError {
  public static statusCode = 404;

  constructor(resource: string, identifier: string | number) {
    const message = `Could not find ${resource} with identifier '${identifier}`;
    super(message, [message]);
  }
}
