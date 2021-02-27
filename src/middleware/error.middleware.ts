import type { SquidMiddleware } from '../server';

export interface SquidError extends Error {
  statusCode?: number;
  errors?: string[];
}

export const ErrorMiddleware = (): SquidMiddleware => async function ErrorMiddlewareHandler(context, next) {
  try {
    await next();

    if (context.response.body?.data) {
      context.response.body.message = 'OK';
      context.response.body.errors = [];
    }
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const errors = error.errors || ['Internal Server Error.'];

    const level = statusCode < 500 ? 'info' : 'error';

    context.logger.log(level, error.message, error);

    context.response.status = statusCode;
    context.response.body = { data: null, errors, message: 'ERROR' };
  }
};
