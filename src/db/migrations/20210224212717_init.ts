import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  /**
   * Create extensions
   */
  await knex.raw(`
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);
}


export async function down(knex: Knex): Promise<void> {
  try {
    /**
     * Drop extensions
     */
    await knex.raw(`
      -- Drop extensions
      DROP EXTENSION IF EXISTS "pgcrypto";
    `)
  } catch {
    // in some databases the pgcrypto extension
    // is already created by the system user
    // so we can't drop it
  }
}
