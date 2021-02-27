
import type { SquidAppContext } from '../server';


export type Query<T> = (context: SquidAppContext) => Promise<T>;

export const Detail = <T>(query: Query<T>) => async (context: SquidAppContext): Promise<void> => {
  const item = await query(context);

  if (item) {
    context.response.status = 200;
    context.response.body = { data: item };
  } else {
    context.response.status = 404;
    context.response.body = { data: null };
  }
};

export const List = <T>(query: Query<T[]>) => async (context: SquidAppContext): Promise<void> => {
  const items = await query(context);

  context.response.body = { data: items };
};

export const Put = <T>(query: Query<T>) => async (context: SquidAppContext): Promise<void> => {
  const item = await query(context);

  context.response.body = { data: item };
};

export const Delete = <T>(query: Query<T>) => async (context: SquidAppContext): Promise<void> => {
  await query(context);

  context.response.body = null;
  context.response.status = 204;
};
