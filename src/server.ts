import type { Server } from 'http';

import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import type knex from 'knex';

import { Logger } from './logger';
import { DatabaseMiddleware } from './db/config';
import { Claim, verify } from './auth';

// Routes
import { V1_USERS_AUTH_VIEWS } from './routes/users/auth.view';
import { V1_STATUS_VIEWS } from './routes/status.view';
import { SquidsController } from './routes/squids.views';

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
  user: Claim | null;
  db: knex;
}

export const AuthMiddleware = async (context: SquidAppContext, next: () => Promise<void>): Promise<void> => {
  const jwt = context.get('Authorization');

  if (jwt) {
    const decoded = await verify(jwt);
    context.user = decoded;
  } else {
    context.user = null;
  }

  await next();
};

export class App {
  private _app: Koa<SquidAppState, SquidAppContext> | null;
  public server: Server | null;
  public readonly config: AppConfig;
  public logger: Logger;

  constructor(config: AppConfig) {
    this.config = config;
    this._app = null;
    this.server = null;
    this.logger = new Logger(config.logging?.quiet ?? false);
  }

  get app(): Koa<SquidAppState, SquidAppContext> {
    if (!this._app) {
      this._app = new Koa<SquidAppState, SquidAppContext>();
      this._app.use(DatabaseMiddleware);
      this._app.use(AuthMiddleware);
      this._app.use(cors());
      this._app.use(bodyParser({ enableTypes: ['json'] }));
      this._app.use(V1_STATUS_VIEWS.routes());
      this._app.use(V1_USERS_AUTH_VIEWS.routes());
      this._app.use(SquidsController.routes());
    }

    return this._app;
  }

  listen(): Server {
    this.logger.log(`Listening on port: ${this.config.server.port}`);

    this.server = this.app.listen(this.config.server.port);

    return this.server;
  }
}

export const start = (port: number): () => Server => {
  const app = new App({ server: { port } });
  const server = app.listen();
  const close = () => server.close();

  return close;
};
