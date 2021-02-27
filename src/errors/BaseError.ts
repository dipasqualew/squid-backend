
export class BaseError extends Error {
  public static statusCode = 500;

  public errors: string[];

  constructor(message: string, errors: string[] = []) {
    super(message);
    this.errors = errors;
  }

  get statusCode(): number {
    return (this.constructor as unknown as BaseError).statusCode;
  }
}
