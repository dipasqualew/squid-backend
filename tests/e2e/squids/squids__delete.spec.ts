import { AxiosResponse } from 'axios';

import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { SquidGenerator } from '../../../src/db/seeds/02_squids.seed';
import { RouteTester } from '../../utils';


RouteTester.test(RouteTester.ROUTES.SQUIDS__DELETE, (tester) => {
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

  describe('Deletes an existing squid', () => {
    let response: AxiosResponse;
    const user = UserGenerator();
    const squid = SquidGenerator({ owner_uuid: user.uuid });

    tester.beforeAll(async () => {
      await tester.db.table('users').insert([user]);
      await tester.db.table('squids').insert([squid]);
      response = await tester.query(null, { uuid: squid.uuid }, user);
    });

    tester.afterAll(async () => {
      await tester.db.table('squids').where('uuid', squid.uuid).delete();
      await tester.db.table('users').where('uuid', user.uuid).delete();
    });

    it('returns HTTP 204', () => {
      expect(response.status).toEqual(204);
    });

    it('returns nothing', () => {
      expect(response.data).toEqual('');
    });

    it('deletes the squid in the db', async () => {
      const actual = await tester.db.select('*').from('squids').where({ uuid: squid.uuid });
      expect(actual).toHaveLength(0);
    });
  });
});
