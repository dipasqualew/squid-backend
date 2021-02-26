/* eslint-disable @typescript-eslint/no-var-requires */
import knex from "knex";
import type { DefaultContext } from 'koa';


const knexfile = require('../../knexfile');


export enum Tables {
  users = 'users',
  squids = 'squids',
  squids_contents = 'squids_contents',
  squads = 'squads',
}

export const TablePriority = [
  Tables.users,
  Tables.squids,
  Tables.squids_contents,
  Tables.squads,
];


export const getDB = (): knex => {
  return knex(knexfile);
};

export const DatabaseMiddleware = async (context: DefaultContext, next: () => Promise<void>): Promise<void> => {
  context.db = getDB();
  await next();
};
