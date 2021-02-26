import type { Server } from 'http';

import cors from '@koa/cors';
import type knex from 'knex';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import type { Logger } from 'winston';

import { Claim } from './auth';
import {
  AuthMiddleware,
  DatabaseMiddleware,
  LoggerMiddleware,
  SquidErrorHandler,
} from './middleware';
import { SquidsController } from './routes/squids';
import { StatusController } from './routes/status';
import { UsersController } from './routes/users';

export interface AppConfig {
  logging?: {
    quiet: boolean,
  },
  server: {
    port: number;
  }
}

export type SquidAppState = Koa.DefaultState;

export interface SquidAppContext extends Koa.Context {
  db: knex;
  logger: Logger;
  user: Claim | null;
}

export type SquidMiddleware = Koa.Middleware<SquidAppState, SquidAppContext>;

export class App {
  private $app: Koa<SquidAppState, SquidAppContext> | null;

  public server: Server | null;

  public readonly config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.$app = null;
    this.server = null;
  }

  get app(): Koa<SquidAppState, SquidAppContext> {
    if (!this.$app) {
      this.$app = new Koa<SquidAppState, SquidAppContext>();
      this.$app.use(LoggerMiddleware());
      this.$app.use(cors());
      this.$app.use(bodyParser({ enableTypes: ['json'] }));
      this.$app.use(DatabaseMiddleware());
      this.$app.use(AuthMiddleware());
      this.$app.use(StatusController.routes());
      this.$app.use(UsersController.routes());
      this.$app.use(SquidsController.routes());
      this.$app.on('error', SquidErrorHandler);
    }

    return this.$app;
  }

  listen(): Server {
    this.server = this.app.listen(this.config.server.port);

    // const baseUrl = `http://localhost:${this.config.server.port}`;

    // this.logger.log('-'.repeat(64));
    // this.logger.log(`Application ready at: ${baseUrl}\n`);
    // this.logger.log('-'.repeat(64));
    // this.logger.log('Routes');
    // this.logger.log('-'.repeat(64));

    // Object.values(ROUTES).forEach((route) => {
    //   let method = route.method;

    //   while (method.length < 7) {
    //     method += " ";
    //   }

    //   this.logger.log(`* ${method} ${baseUrl}${route.path}`);
    // });
    // this.logger.log('-'.repeat(64));

    return this.server;
  }
}

export const start = (port: number): () => Server => {
  const app = new App({ server: { port } });
  const server = app.listen();
  const close = () => server.close();

  return close;
};
