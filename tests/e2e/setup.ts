import { migrateDB } from './utils';

beforeAll(async () => {
  await migrateDB();
});
