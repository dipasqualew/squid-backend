import Router from '@koa/router';

import {
  Delete, Detail, List, Put,
} from '../api/views';
import type { Squid } from '../db/models';
import type { SquidAppContext, SquidAppState } from '../server';
import { ROUTES } from './config';

export const SquidsDetail = Detail((context) => {
  const uuid: string = context.params.uuid;

  return context.db
    .select<Squid[]>('squids.uuid', 'squids.owner_uuid', 'squids.title', 'squids.content_type', 'squids.public', 'squids_contents.contents')
    .from('squids')
    .leftJoin('squids_contents', 'squids.uuid', 'squids_contents.uuid')
    .where({ 'squids.uuid': uuid })
    .first();
});

export const SquidsList = List(
  (context) => context.db
    .select<Squid[]>('*')
    .from('squids'),
);

export const SquidsPut = Put(async (context) => {
  const payload = context.request.body;

  await context.db('squids')
    .insert(payload)
    .onConflict('uuid')
    .merge();

  return payload;
});

export const SquidsDelete = Delete((context) => {
  const uuid: string = context.params.uuid;

  return context.db('squids').where({ uuid }).delete();
});

export const SquidsController = new Router<SquidAppState, SquidAppContext>()
  .get(ROUTES.SQUIDS__DETAIL.path, SquidsDetail)
  .get(ROUTES.SQUIDS__LIST.path, SquidsList)
  .put(ROUTES.SQUIDS__PUT.path, SquidsPut)
  .delete(ROUTES.SQUIDS__DELETE.path, SquidsDelete);
