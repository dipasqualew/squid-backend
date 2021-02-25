import Router from '@koa/router';

import type { SquidAppState, SquidAppContext } from '../server';

export const Status = async (context: SquidAppContext): Promise<void> => {
  context.body = { status: 'OK' };
};

export const V1_STATUS_VIEWS = new Router<SquidAppState, SquidAppContext>();

V1_STATUS_VIEWS
  .get('/v1/status', Status);
