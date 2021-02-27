import { AxiosResponse } from 'axios';

import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { SquidContentsGenerator, SquidGenerator } from '../../../src/db/seeds/02_squids.seed';
import { RouteTester } from '../../utils';

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
        const actual = response.data.data;

        expect(actual).toEqual({ ...squid, ...squidContent });
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
        const actual = response.data.data;

        expect(actual).toEqual(null);
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

  RouteTester.test(RouteTester.ROUTES.SQUIDS__PUT, (tester) => {
    describe('Creates a new squid', () => {
      let response: AxiosResponse;
      const user = UserGenerator();
      const payload = SquidGenerator({ owner_uuid: user.uuid });

      tester.beforeAll(async () => {
        await tester.db.table('users').insert([user]);
        response = await tester.query(payload);
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
        response = await tester.query(payload);
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

  RouteTester.test(RouteTester.ROUTES.SQUIDS__DELETE, (tester) => {
    describe('Deletes an existing squid', () => {
      let response: AxiosResponse;
      const user = UserGenerator();
      const squid = SquidGenerator({ owner_uuid: user.uuid });

      tester.beforeAll(async () => {
        await tester.db.table('users').insert([user]);
        await tester.db.table('squids').insert([squid]);
        response = await tester.query(null, { uuid: squid.uuid });
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
});
