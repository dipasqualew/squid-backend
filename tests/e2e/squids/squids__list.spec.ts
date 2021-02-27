import { AxiosResponse } from 'axios';

import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { SquidGenerator } from '../../../src/db/seeds/02_squids.seed';
import { RouteTester } from '../../utils';


RouteTester.test(RouteTester.ROUTES.SQUIDS__LIST, (tester) => {
  describe('With no squids', () => {
    let response: AxiosResponse;

    tester.beforeAll(async () => {
      response = await tester.query();
    });

    tester.afterAll();

    it('returns HTTP 200', () => {
      expect(response.status).toEqual(200);
    });

    it('returns an empty array', () => {
      expect(response.data.data).toEqual([]);
    });
  });

  describe('With squids', () => {
    const user = UserGenerator();
    const squid = SquidGenerator({ owner_uuid: user.uuid });

    let response: AxiosResponse;

    tester.beforeAll(async () => {
      await tester.db.table('users').insert([user]);
      await tester.db.table('squids').insert([squid]);
      response = await tester.query();
    });

    tester.afterAll(async () => {
      await tester.db.table('squids').where('uuid', squid.uuid).delete();
      await tester.db.table('users').where('uuid', user.uuid).delete();
    });

    it('returns HTTP 200', () => {
      expect(response.status).toEqual(200);
    });

    it('returns an array of existing squids', () => {
      expect(response.data.data).toEqual([squid]);
    });
  });
});
