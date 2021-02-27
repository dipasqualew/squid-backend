/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-var-requires */

import axios, { AxiosResponse } from 'axios';
import knex from 'knex';

import { Claim, sign } from '../src/auth';
import { TablePriority } from '../src/db/config';
import { ROUTES, Route } from '../src/routes/config';
import { App } from '../src/server';

const knexfile = require('../knexfile');

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

export const formatUrl = (base: string, params: Record<string, string> | null): string => {
  let formatted = base;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const regex = new RegExp(`:${key}`);
      formatted = formatted.replace(regex, value);
    });
  }

  return formatted;
};

export const query = async (
  route: Route,
  port: number,
  data: Record<string, unknown> | null = null,
  params: Record<string, string> = {},
  claim: Claim | null = null,
): Promise<AxiosResponse<unknown>> => {
  const formatted = formatUrl(route.path, params);
  const url = `http://localhost:${port}${formatted}`;
  const headers: Record<string, string> = {};

  if (claim) {
    const jwt = await sign(claim);
    headers.Authorization = jwt;
  }

  const response = await axios.request({
    url,
    data,
    method: route.method,
    headers,
    validateStatus: () => true,
  });

  return response;
};

export type ResponseContext = { response: AxiosResponse } & Record<string, unknown>;
export type SetupFunction<T extends ResponseContext> = () => Promise<T>;
export type TeardownFunction<T extends ResponseContext> = (context: T) => Promise<void>;

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
      db: getDB(),
      logger: {
        level: 'error',
      },
      server: {
        port: this.port,
      },
    });
  }

  async query(
    data: Record<string, unknown> | null = null,
    params: Record<string, string> = {},
    claim: Claim | null = null,
  ): Promise<AxiosResponse<unknown>> {
    return query(this.route, this.port, data, params, claim);
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

  test403<T extends ResponseContext>(description: string, setup: SetupFunction<T>, teardown?: TeardownFunction<T>): void {
    describe(description, () => {
      let context: T;

      this.beforeAll(async () => {
        context = await setup();
      });

      this.afterAll(async () => {
        if (teardown) {
          await teardown(context);
        }
      });

      it('returns HTTP 403', () => {
        expect(context.response.status).toEqual(403);
      });

      it('returns an explanation to the client', () => {
        const actual = context.response.data;
        expect(actual.message).toEqual('ERROR');
      });
    });
  }

  test404<T extends ResponseContext>(description: string, setup: SetupFunction<T>, teardown?: TeardownFunction<T>): void {
    describe(description, () => {
      let context: T;

      this.beforeAll(async () => {
        context = await setup();
      });

      this.afterAll(async () => {
        if (teardown) {
          await teardown(context);
        }
      });

      it('returns HTTP 404', () => {
        expect(context.response.status).toEqual(404);
      });

      it('returns an explanation to the client', () => {
        const actual = context.response.data;
        expect(actual.message).toEqual('ERROR');
      });
    });
  }

  static test(route: Route, func: (tester: RouteTester) => void): void {
    const tester = new this(route);
    describe(route.label, () => func(tester));
  }
}
