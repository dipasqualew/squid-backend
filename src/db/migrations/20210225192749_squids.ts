import * as Knex from 'knex';

import { Tables } from '../config';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(Tables.squids, (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('owner_uuid')
      .references('uuid')
      .inTable(Tables.users)
      .notNullable();

    table.string('title', 512)
      .notNullable()
      .defaultTo('');

    table.string('content_type')
      .notNullable();

    table.string('public')
      .notNullable()
      .defaultTo('PRIVATE');
  });

  await knex.schema.createTable(Tables.squids_contents, (table) => {
    table.uuid('uuid')
      .primary()
      .references('uuid')
      .inTable(Tables.squids);

    table.text('contents')
      .notNullable()
      .defaultTo('');
  });

  await knex.schema.createTable(Tables.squids_links, (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('start')
      .references('uuid')
      .inTable(Tables.squids);

    table.uuid('end')
      .references('uuid')
      .inTable(Tables.squids);

    table.unique(['start', 'end']);
  });

  await knex.schema.createTable(Tables.squads, (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table.text('title')
      .notNullable();

    table.text('description')
      .notNullable()
      .defaultTo('');

    table.string('public')
      .notNullable()
      .defaultTo('PRIVATE');
  });

  await knex.schema.createTable(Tables.squids_in_squads, (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('squad_uuid')
      .references('uuid')
      .inTable(Tables.squads);

    table.uuid('squid_uuid')
      .references('uuid')
      .inTable(Tables.squids);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(Tables.squids_in_squads);
  await knex.schema.dropTable(Tables.squads);
  await knex.schema.dropTable(Tables.squids_links);
  await knex.schema.dropTable(Tables.squids_contents);
  await knex.schema.dropTable(Tables.squids);
}
