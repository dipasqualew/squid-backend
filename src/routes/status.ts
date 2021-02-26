import Router from '@koa/router';

import type { SquidAppContext, SquidAppState } from '../server';
import { ROUTES } from './config';

export const Status = async (context: SquidAppContext): Promise<void> => {
  context.body = { status: 'OK' };
};

export const StatusController = new Router<SquidAppState, SquidAppContext>();

StatusController
  .get(ROUTES.STATUS.path, Status);
