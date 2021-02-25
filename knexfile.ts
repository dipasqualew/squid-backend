/* eslint-disable @typescript-eslint/no-var-requires */

const dotenv = require('dotenv');

dotenv.config();

const config = (options: Record<string, unknown> = {}) => ({
  client: 'postgresql',
  connection: process.env.POSTGRESQL_CONNECTION_STRING,
  pool: {
    min: 2,
    max: 20
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
  ...options,
});

module.exports = config();
