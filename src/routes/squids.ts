import Router from '@koa/router';

import type { Squid } from '../db/models/Squid';
import type { SquidAppContext, SquidAppState } from '../server';
import { ROUTES } from './config';

export const SquidsDetail = async (context: SquidAppContext): Promise<void> => {
  const uuid: string = context.params.uuid;

  const squid = await context.db
    .select<Squid[]>('squids.uuid', 'squids.owner_uuid', 'squids.title', 'squids.content_type', 'squids.public', 'squids_contents.contents')
    .from('squids')
    .leftJoin('squids_contents', 'squids.uuid', 'squids_contents.uuid')
    .where({ 'squids.uuid': uuid })
    .first();

  if (squid) {
    context.status = 200;
    context.body = { data: squid };
  } else {
    context.status = 404;
    context.body = { data: null };
  }
};

export const SquidsList = async (context: SquidAppContext): Promise<void> => {
  const squids = await context.db
    .select<Squid[]>('*')
    .from('squids');

  context.body = { data: squids };
};

export const SquidsController = new Router<SquidAppState, SquidAppContext>()
  .get(ROUTES.SQUIDS__DETAIL.path, SquidsDetail)
  .get(ROUTES.SQUIDS__LIST.path, SquidsList);
