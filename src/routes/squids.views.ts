import Router from '@koa/router';

import type { SquidAppState, SquidAppContext } from '../server';
import type { Squid } from '../db/models/Squid';

export const SquidDetail = async (context: SquidAppContext): Promise<void> => {
  const uuid: string = context.params.uuid;

  const squid = await context.db
    .select<Squid[]>('*')
    .from('squids')
    .where({ uuid })
    .first();

  if (squid) {
    context.status = 200;
    context.body = { data: squid };
  } else {
    context.status = 404;
    context.body = { data: null };
  }
};

export const SquidList = async (context: SquidAppContext): Promise<void> => {
  const squids = await context.db
    .select<Squid[]>('*')
    .from('squids');

  context.body = { data: squids };
};

export const SquidsController = new Router<SquidAppState, SquidAppContext>()
  .get('/v1/squids/:uuid', SquidDetail)
  .get('/v1/squids', SquidList);
