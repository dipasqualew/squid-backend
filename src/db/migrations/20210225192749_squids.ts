import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('squids', (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    table.uuid('owner_uuid')
      .references('uuid')
      .inTable('users')
      .notNullable();

    table.string('title', 512)
      .notNullable()
      .defaultTo('');

    table.string('contentType')
      .notNullable();

    table.string('public')
      .notNullable()
      .defaultTo('PRIVATE');
  });

  await knex.schema.createTable('squids_contents', (table) => {
    table.uuid('uuid')
      .primary()
      .references('uuid')
      .inTable('squids');

    table.text('contents')
      .notNullable()
      .defaultTo('');
  });

  await knex.schema.createTable('squads', (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    table.uuid('start')
      .references('uuid')
      .inTable('squids');

    table.uuid('end')
      .references('uuid')
      .inTable('squids');

    table.unique(['start', 'end']);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('squads');
  await knex.schema.dropTable('squids_contents');
  await knex.schema.dropTable('squids');
}
