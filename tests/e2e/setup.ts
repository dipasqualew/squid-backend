import { migrateDB, truncateDB, destroyDBConnection } from './utils';


beforeAll(async () => {
  await migrateDB();
  await truncateDB();
});

afterAll(async () => {
  await truncateDB();
  await destroyDBConnection();
});
