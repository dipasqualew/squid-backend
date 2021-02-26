import { AxiosResponse } from 'axios';

import { RouteTester } from '../utils';
import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { SquidGenerator, SquidContentsGenerator } from '../../../src/db/seeds/02_squids.seed';

describe('e2e.routes.users', () => {
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
        const squid = response.data.data;

        expect(squid).toEqual({ ...squid, ...squidContent });
      });
    });

    describe('Returns null with a random uuid', () => {
      let response: AxiosResponse;
      const randomSquid = SquidGenerator({ owner_uuid: user.uuid });

      beforeAll(async () => {
        response = await tester.query(null, { uuid: randomSquid.uuid });
      });

      it('returns HTTP 404', () => {
        expect(response.status).toEqual(404);
      });

      it('joins the squid and the squid content', () => {
        const squid = response.data.data;

        expect(squid).toEqual(null);
      });
    });
  });

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
      const squidContent = SquidContentsGenerator({ uuid: squid.uuid });

      let response: AxiosResponse;

      tester.beforeAll(async () => {
        await tester.db.table('users').insert([user]);
        await tester.db.table('squids').insert([squid]);
        await tester.db.table('squids_contents').insert([squidContent]);
        response = await tester.query();
      });

      tester.afterAll(async () => {
        await tester.db.table('squids_contents').where('uuid', squidContent.uuid).delete();
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

});
