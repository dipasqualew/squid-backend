
import { Http403, Http404 } from '../errors';
import type { SquidAppContext } from '../server';

export type Query<T> = (context: SquidAppContext) => Promise<T>;


export const Detail = <T>(resource: string, param = 'uuid', auth = true, query: Query<T>) => async (context: SquidAppContext): Promise<void> => {
  const identifier = context.params[param];
  let item = null;

  if (auth && !context.user) {
    throw new Http403(resource, identifier);
  }

  item = await query(context);

  if (item) {
    context.response.status = 200;
    context.response.body = { data: item };
  } else {
    throw new Http404(resource, identifier);
  }
};

export const List = <T>(resource: string, auth = true, query: Query<T[]>) => async (context: SquidAppContext): Promise<void> => {
  if (auth && !context.user) {
    throw new Http403(resource, 'list');
  }

  const items = await query(context);

  context.response.body = { data: items };
};

export const Put = <T>(resource: string, auth = true, query: Query<T>) => async (context: SquidAppContext): Promise<void> => {
  if (auth && !context.user) {
    throw new Http403(resource, 'put');
  }

  const item = await query(context);

  context.response.body = { data: item };
};

export const Delete = <T>(resource: string, auth: true, query: Query<T>) => async (context: SquidAppContext): Promise<void> => {
  if (auth && !context.user) {
    throw new Http403(resource, 'delete');
  }

  await query(context);

  context.response.body = null;
  context.response.status = 204;
};
