import Router from '@koa/router';
import type { Context } from 'koa';

import { Claim, sign } from '../auth';
import { getDB } from '../db/config';
import { ROUTES } from './config';


export const UsersAuth = async (context: Context): Promise<void> => {
  const db = getDB();
  const rows = await db
    .select<Claim[]>('uuid', 'email')
    .from('users')
    .where({
      email: context.request.body.email,
      password: db.raw(`crypt('${context.request.body.password}', password)`),
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

export const UsersController = new Router()
  .post(ROUTES.USERS__AUTH.path, UsersAuth);
