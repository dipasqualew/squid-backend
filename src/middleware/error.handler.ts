import type { SquidAppContext } from '../server';

export interface SquidError extends Error {
  statusCode?: number;
  errors?: string[];
}

export const SquidErrorHandler = async (error: SquidError, context: SquidAppContext): Promise<void> => {
  const statusCode = error.statusCode || 500;
  const errors = error.errors || ['Internal Server Error.'];

  context.logger.log('error', error.message, error);
  context.throw(statusCode, errors.join('\n'), { errors });
};
