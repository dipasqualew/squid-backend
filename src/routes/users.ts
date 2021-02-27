import Router from '@koa/router';

import { Claim, sign } from '../auth';
import type { SquidAppContext, SquidAppState } from '../server';
import { ROUTES } from './config';


export const UsersAuth = async (context: SquidAppContext): Promise<void> => {
  const rows = await context.db
    .select<Claim[]>('uuid', 'email')
    .from('users')
    .where({
      email: context.request.body.email,
      password: context.db.raw(`crypt('${context.request.body.password}', password)`),
    });

  if (rows.length === 1) {
    const jwt = await sign(rows[0]);

    context.response.status = 200;
    context.response.body = { jwt };
  } else {
    context.response.status = 403;
    context.response.body = {
      errors: [
        'Not Authorized',
      ],
    };
  }
};

export const UsersController = new Router<SquidAppState, SquidAppContext>()
  .post(ROUTES.USERS__AUTH.path, UsersAuth);
