import { getDB } from './db/config';
import { App, AppConfig } from './server';

const APP_CONFIG: AppConfig = {
  db: getDB(),
  server: {
    port: 3000,
  },
};

const app = new App(APP_CONFIG);

app.listen();
