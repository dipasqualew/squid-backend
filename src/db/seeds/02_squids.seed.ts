import * as Knex from "knex";

import { USERS } from './01_users.seed';

export const SQUIDS = {
  DEFAULT: {
    uuid: '4e1db50e-d61e-4093-b7cc-966c3d1ac58d',
    owner_uuid: USERS.DEFAULT.uuid,
    title: 'Divina Commedia - Inferno - Canto I',
    contentType: 'TEXT',
    public: 'PUBLIC',
  },
};

export async function seed(knex: Knex): Promise<void> {
  await knex("squids").del();

  await knex("squids").insert(Object.values(SQUIDS));
}
