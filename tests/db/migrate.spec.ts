import { destroyDBConnection, migrateDB, rollbackDB } from '../utils';

describe('db.migrate', () => {
  beforeAll(async () => {
    await rollbackDB();
  });

  afterAll(async () => {
    await destroyDBConnection();
  });

  it('migrates and rollbacks successfully', async () => {
    await migrateDB();
    await rollbackDB();
  });
});
