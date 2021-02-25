import * as Knex from "knex";

export const USERS = {
  DEFAULT: {
    uuid: '0c1cb9e1-30ae-405f-9c61-888cb2d03b90',
    full_name: 'Dante Alighieri',
    preferred_name: 'Dante',
    email: 'dante.alighieri@dipasqualew.com',
    password: 'test',
  },
};

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert(Object.values(USERS));
}
