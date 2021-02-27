import * as Knex from 'knex';

import { Tables } from '../config';

export async function up(knex: Knex): Promise<void> {
  /**
   * Create users table
   */
  await knex.schema.createTable(Tables.users, (table) => {
    table.uuid('uuid')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table.text('full_name')
      .notNullable()
      .defaultTo('');

    table.text('preferred_name')
      .notNullable()
      .defaultTo('');

    table.text('email')
      .unique()
      .notNullable();

    table.text('password')
      .notNullable();
  });

  /**
   * Create hashing function and triggers for passwords
   */
  await knex.raw(`
    -- Create hashing function
    CREATE FUNCTION hash_user_password() RETURNS TRIGGER AS
    $$
    BEGIN
      NEW.password = crypt(NEW.password, gen_salt('bf'));
      RETURN NEW;
    END;
    $$ LANGUAGE PLPGSQL;


    -- Trigger hashing function on insert
    CREATE TRIGGER trigger_hash_user_password_on_insert
      BEFORE INSERT
      ON ${Tables.users}
      FOR EACH ROW
      EXECUTE PROCEDURE hash_user_password();

    -- Trigger hashing function on update
    CREATE TRIGGER trigger_hash_user_password_on_update
      BEFORE UPDATE
      ON ${Tables.users}
      FOR EACH ROW
      EXECUTE PROCEDURE hash_user_password();
  `);
}


export async function down(knex: Knex): Promise<void> {
  /**
   * Drop hashing function and triggers for passwords
   */
  await knex.raw(`
    -- Drop triggers
    DROP TRIGGER trigger_hash_user_password_on_insert ON ${Tables.users};
    DROP TRIGGER trigger_hash_user_password_on_update ON ${Tables.users};

    -- Drop functions
    DROP FUNCTION hash_user_password;
  `);

  /**
   * Drop users table
   */
  await knex.schema.dropTable(Tables.users);
}
