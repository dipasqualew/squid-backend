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
  ErrorMiddleware,
  LoggerMiddleware,
} from './middleware';
import { SquidsController } from './routes/squids';
import { StatusController } from './routes/status';
import { UsersController } from './routes/users';

export interface AppConfig {
  logger: {
    level: string,
  },
  db: knex;
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
      this.$app
        .use(LoggerMiddleware(this.config.logger))
        .use(cors())
        .use(bodyParser({ enableTypes: ['json'] }))
        .use(ErrorMiddleware())
        .use(DatabaseMiddleware(this.config.db))
        .use(AuthMiddleware())
        .use(StatusController.routes())
        .use(UsersController.routes())
        .use(SquidsController.routes());
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
