import * as Knex from 'knex';
import { v4 as uuid4 } from 'uuid';

import {
  ContentType, PublicState, Squad, Squid, SquidContents,
} from '../models/Squid';
import { USERS } from './01_users.seed';

export const SQUIDS: Record<string, Squid> = {
  DEFAULT: {
    uuid: '4e1db50e-d61e-4093-b7cc-966c3d1ac58d',
    owner_uuid: USERS.DEFAULT.uuid,
    title: 'Divina Commedia - Inferno - Canto I',
    content_type: ContentType.TEXT,
    public: PublicState.PUBLIC,
  },
  TEXT: {
    uuid: '33b49c88-7a5f-4238-8a00-21ae44aecfa9',
    owner_uuid: USERS.DEFAULT.uuid,
    title: 'Vita Nova',
    content_type: ContentType.TEXT,
    public: PublicState.PUBLIC,
  },
  IMAGE: {
    uuid: 'eda4529b-144e-4fe1-80c6-53d78ede31c4',
    owner_uuid: USERS.MICHELANGELO.uuid,
    title: 'La Pieta',
    content_type: ContentType.IMAGE,
    public: PublicState.PUBLIC,
  },
  PRIVATE: {
    uuid: 'efa8bf82-33fc-44dc-9eaa-1bd1c4b977e0',
    owner_uuid: USERS.MICHELANGELO.uuid,
    title: 'Lettere Private',
    content_type: ContentType.TEXT,
    public: PublicState.PRIVATE,
  },
};

export const SQUIDS_CONTENTS: Record<string, SquidContents> = {
  DEFAULT: {
    uuid: '4e1db50e-d61e-4093-b7cc-966c3d1ac58d',
    contents: 'Nel mezzo di cammin di nostra vita...',
  },
  TEXT: {
    uuid: '33b49c88-7a5f-4238-8a00-21ae44aecfa9',
    contents: 'Tanto gentile e tanto onesta pare...',
  },
  IMAGE: {
    uuid: 'eda4529b-144e-4fe1-80c6-53d78ede31c4',
    contents: 'images/eda4529b-144e-4fe1-80c6-53d78ede31c4.jpg',
  },
  PRIVATE: {
    uuid: 'efa8bf82-33fc-44dc-9eaa-1bd1c4b977e0',
    contents: 'Miki\'s letters are no one\'s business',
  },
};

export const SQUADS: Record<string, Squad> = {
  DEFAULT: {
    uuid: 'c2c5cf1e-5f0a-49be-a64a-68e470deb32b',
    start: SQUIDS.DEFAULT.uuid,
    end: SQUIDS.TEXT.uuid,
  },
  PUBLIC_PRIVATE: {
    uuid: 'd2ee1e96-c527-4831-b08e-eae1c351b238',
    start: SQUIDS.IMAGE.uuid,
    end: SQUIDS.PRIVATE.uuid,
  },
};

export const SquidGenerator = (overrides: Partial<Squid> = {}): Required<Squid> => ({
  uuid: uuid4(),
  owner_uuid: uuid4(),
  title: uuid4(),
  content_type: ContentType.TEXT,
  public: PublicState.PUBLIC,
  ...overrides,
});

export const SquidContentsGenerator = (overrides: Partial<SquidContents> = {}): Required<SquidContents> => ({
  uuid: uuid4(),
  contents: uuid4(),
  ...overrides,
});

export const SquadGenerator = (overrides: Partial<Squad> = {}): Required<Squad> => ({
  uuid: uuid4(),
  start: uuid4(),
  end: uuid4(),
  ...overrides,
});

export async function seed(knex: Knex): Promise<void> {
  await knex('squads').del();
  await knex('squids_contents').del();
  await knex('squids').del();

  await knex('squids').insert(Object.values(SQUIDS));
  await knex('squids_contents').insert(Object.values(SQUIDS_CONTENTS));
  await knex('squads').insert(Object.values(SQUADS));
}
