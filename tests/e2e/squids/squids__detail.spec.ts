import { AxiosResponse } from 'axios';

import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { SquidContentsGenerator, SquidGenerator } from '../../../src/db/seeds/02_squids.seed';
import { RouteTester } from '../../utils';

RouteTester.test(RouteTester.ROUTES.SQUIDS__DETAIL, (tester) => {
  const user = UserGenerator();
  const squid = SquidGenerator({ owner_uuid: user.uuid });
  const squidContent = SquidContentsGenerator({ uuid: squid.uuid });

  tester.beforeAll(async () => {
    await tester.db.table('users').insert([user]);
    await tester.db.table('squids').insert([squid]);
    await tester.db.table('squids_contents').insert([squidContent]);
  });

  tester.afterAll(async () => {
    await tester.db.table('squids_contents').where('uuid', squidContent.uuid).delete();
    await tester.db.table('squids').where('uuid', squid.uuid).delete();
    await tester.db.table('users').where('uuid', user.uuid).delete();
  });

  describe('Finds an existing squid', () => {
    let response: AxiosResponse;

    beforeAll(async () => {
      response = await tester.query(null, { uuid: squid.uuid });
    });

    it('returns HTTP 200', () => {
      expect(response.status).toEqual(200);
    });

    it('joins the squid and the squid content', () => {
      const actual = response.data.data;

      expect(actual).toEqual({ ...squid, ...squidContent });
    });
  });

  tester.test404('HTTP 404 with a random uuid', async () => {
    const randomSquid = SquidGenerator({ owner_uuid: user.uuid });
    const response = await tester.query(null, { uuid: randomSquid.uuid });
    return { response };
  });
});
