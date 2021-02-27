/* eslint-disable @typescript-eslint/no-var-requires */
import knex from 'knex';

const knexfile = require('../../knexfile');


export enum Tables {
  users = 'users',
  squids = 'squids',
  squids_contents = 'squids_contents',
  squids_links = 'squids_links',
  squads = 'squads',
  squids_in_squads = 'squids_in_squads',
}

export const TablePriority = [
  Tables.users,
  Tables.squids,
  Tables.squids_contents,
  Tables.squids_links,
  Tables.squads,
  Tables.squids_in_squads,
];


export const getDB = (): knex => knex(knexfile);
