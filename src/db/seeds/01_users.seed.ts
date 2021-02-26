import * as Knex from 'knex';
import { v4 as uuid4 } from 'uuid';

import type { User } from '../models/User';


export const USERS: Record<string, Required<User>> = {
  DEFAULT: {
    uuid: '0c1cb9e1-30ae-405f-9c61-888cb2d03b90',
    full_name: 'Dante Alighieri',
    preferred_name: 'Dante',
    email: 'dante.alighieri@dipasqualew.com',
    password: 'test',
  },
  MICHELANGELO: {
    uuid: 'cf5460c6-ae65-42ca-a035-ec3d5eeb1919',
    full_name: 'Michelangelo di Lodovico Buonarroti Simoni',
    preferred_name: 'Michelangelo',
    email: 'michelangelo.buonarroti@dipasqualew.com',
    password: 'LaP1eta%Nel1aB4silicaDiSanPi3tro',
  },
};

export const UserGenerator = (overrides: Partial<User> = {}): Required<User> => ({
  uuid: uuid4(),
  full_name: uuid4(),
  preferred_name: uuid4(),
  email: `${uuid4()}@${uuid4()}.com`,
  password: uuid4(),
  ...overrides,
});

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert(Object.values(UserGenerator));
}
