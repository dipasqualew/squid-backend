import Router from '@koa/router';

import { ROUTES } from './config';
import type { SquidAppState, SquidAppContext } from '../server';

export const Status = async (context: SquidAppContext): Promise<void> => {
  context.body = { status: 'OK' };
};

export const StatusController = new Router<SquidAppState, SquidAppContext>();

StatusController
  .get(ROUTES.STATUS.path, Status);
