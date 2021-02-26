/* eslint-disable @typescript-eslint/no-var-requires */

import axios, { AxiosResponse } from 'axios';
import knex from 'knex';

import { TablePriority } from '../../src/db/config';
import { ROUTES, Route } from '../../src/routes/config';
import { App } from '../../src/server';

const knexfile = require('../../knexfile');

export const getDB = (): knex => {
  type globalWithDb = typeof global & { db?: knex };
  const db = (global as globalWithDb).db || knex(knexfile);

  (global as globalWithDb).db = db;

  return db;
};

export const destroyDBConnection = async (): Promise<boolean> => {
  type globalWithDb = typeof global & { db?: knex };
  const db = (global as globalWithDb).db;

  if (db) {
    await db.destroy();
    return true;
  }

  return false;
};

export const migrateDB = async (): Promise<void> => {
  const db = getDB();
  await db.migrate.latest();
};

export const seedDB = async (): Promise<void> => {
  const db = getDB();
  await db.seed.run();
};

export const truncateDB = async (): Promise<void> => {
  const db = getDB();

  for (const table of TablePriority.slice().reverse()) {
    await db.raw(`TRUNCATE TABLE ${table} CASCADE`);
  }
};

export const rollbackDB = async (): Promise<void> => {
  const db = getDB();
  await db.migrate.rollback();
};

export const formatUrl = (base: string, params: Record<string, string>): string => {
  let formatted = base;

  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`:${key}`);
    formatted = formatted.replace(regex, value);
  });

  return formatted;
};

export const query = async (
  route: Route,
  port: number,
  data: Record<string, unknown> | null = null,
  params: Record<string, string> = {},
): Promise<AxiosResponse<unknown>> => {
  const formatted = formatUrl(route.path, params);
  const url = `http://localhost:${port}${formatted}`;

  const response = await axios.request({
    url,
    data,
    method: route.method,
    validateStatus: () => true,
  });

  return response;
};

export class RouteTester {
  static ROUTES = ROUTES;

  public app: App;

  public db: knex;

  public route: Route;

  public port: number;

  constructor(route: Route) {
    this.route = route;

    // Let the OS generate a random port.
    // Once the server is bind, we will update
    // the port. See `beforeAll` method.
    this.port = 0;

    this.db = getDB();

    this.app = new App({
      logging: {
        quiet: true,
      },
      server: {
        port: this.port,
      },
    });
  }

  async query(
    data: Record<string, unknown> | null = null,
    params: Record<string, string> = {},
  ): Promise<AxiosResponse<unknown>> {
    return query(this.route, this.port, data, params);
  }

  beforeAll(func: (() => Promise<void>) | null = null): void {
    beforeAll(async () => {
      const server = await this.app.listen();
      this.port = (server.address() as unknown as { port: number }).port;

      if (func) {
        await func();
      }
    });
  }

  afterAll(func: (() => Promise<void>) | null = null): void {
    afterAll(async () => {
      if (func) {
        await func();
      }

      await this.app.server?.close();
    });
  }

  static test(route: Route, func: (tester: RouteTester) => void): void {
    const tester = new this(route);
    describe(route.label, () => func(tester));
  }
}
