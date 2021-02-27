import { AxiosResponse } from 'axios';

import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { SquidGenerator } from '../../../src/db/seeds/02_squids.seed';
import { RouteTester } from '../../utils';

RouteTester.test(RouteTester.ROUTES.SQUIDS__PUT, (tester) => {
  tester.test403('Without authorization', async () => {
    const user = UserGenerator();
    const squid = SquidGenerator({ owner_uuid: user.uuid });

    await tester.db.table('users').insert([user]);
    await tester.db.table('squids').insert([squid]);
    const response = await tester.query(null, { uuid: squid.uuid });

    return { user, squid, response };
  }, async (context) => {
    await tester.db.table('squids').where('uuid', context.squid.uuid).delete();
    await tester.db.table('users').where('uuid', context.user.uuid).delete();
  });

  describe('Creates a new squid', () => {
    let response: AxiosResponse;
    const user = UserGenerator();
    const payload = SquidGenerator({ owner_uuid: user.uuid });

    tester.beforeAll(async () => {
      await tester.db.table('users').insert([user]);
      response = await tester.query(payload, undefined, user);
    });

    tester.afterAll(async () => {
      await tester.db.table('squids').where('uuid', payload.uuid).delete();
      await tester.db.table('users').where('uuid', user.uuid).delete();
    });

    it('returns HTTP 200', () => {
      expect(response.status).toEqual(200);
    });

    it('returns the squid', () => {
      expect(response.data.data).toEqual(payload);
    });

    it('creates the squid in the db', async () => {
      const actual = await tester.db.select('*').from('squids').where({ uuid: payload.uuid }).first();
      expect(actual).toEqual(payload);
    });
  });

  describe('Updates an existing squid', () => {
    let response: AxiosResponse;
    const user = UserGenerator();
    const squid = SquidGenerator({ owner_uuid: user.uuid });
    const payload = { ...squid, title: 'A New Title' };

    tester.beforeAll(async () => {
      await tester.db.table('users').insert([user]);
      await tester.db.table('squids').insert([squid]);
      response = await tester.query(payload, null, user);
    });

    tester.afterAll(async () => {
      await tester.db.table('squids').where('uuid', squid.uuid).delete();
      await tester.db.table('users').where('uuid', user.uuid).delete();
    });

    it('returns HTTP 200', () => {
      expect(response.status).toEqual(200);
    });

    it('returns the squid', () => {
      expect(response.data.data).toEqual(payload);
    });

    it('creates the squid in the db', async () => {
      const actual = await tester.db.select('*').from('squids').where({ uuid: payload.uuid }).first();
      expect(actual).toEqual(payload);
    });
  });
});
