import type { Context } from 'koa';
import Router from '@koa/router';

import { getDB } from '../../db/config';
import { Claim, sign } from '../../auth';


export const GenerateJWT = async (context: Context): Promise<void> => {
  context.response.headers['access-control-allow-origin'] = '*';

  const db = getDB();
  const rows = await db
    .select<Claim[]>('uuid', 'email')
    .from('users')
    .where({
      email: context.request.body.email,
      password: db.raw(`crypt('${context.request.body.password}', password)`)
    });

  if (rows.length === 1) {
    const jwt = await sign(rows[0]);

    context.response.status = 200;
    context.response.body = { jwt };
  } else {
    context.response.status = 403;
    context.response.body = {
      errors: [
        'Not Authorized'
      ]
    };
  }

};

export const V1_USERS_AUTH_VIEWS = new Router();

V1_USERS_AUTH_VIEWS
  .post('/v1/users/auth/jwt', GenerateJWT);
