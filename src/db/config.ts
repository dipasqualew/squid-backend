/* eslint-disable @typescript-eslint/no-var-requires */
import knex from 'knex';

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


export const getDB = (): knex => knex(knexfile);
