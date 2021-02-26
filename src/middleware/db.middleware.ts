import { getDB } from '../db/config';
import type { SquidMiddleware } from '../server';

export const DatabaseMiddleware = (): SquidMiddleware => {
  const connection = getDB();

  return async function Database(context, next): Promise<void> {
    context.db = connection;

    await next();
  };
};
