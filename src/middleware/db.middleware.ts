import knex from 'knex';

import type { SquidMiddleware } from '../server';

export const DatabaseMiddleware = (connection: knex): SquidMiddleware => async function Database(context, next): Promise<void> {
  context.db = connection;

  await next();
};
