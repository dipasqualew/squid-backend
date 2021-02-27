import { getDB } from './db/config';
import { App, AppConfig } from './server';

const APP_CONFIG: AppConfig = {
  db: getDB(),
  logger: {
    level: 'info',
  },
  server: {
    port: 3000,
  },
};

const app = new App(APP_CONFIG);

app.listen();
