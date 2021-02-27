import { AxiosResponse } from 'axios';

import { verify } from '../../../src/auth';
import { UserGenerator } from '../../../src/db/seeds/01_users.seed';
import { RouteTester } from '../../utils';

describe('e2e.routes.users', () => {
  RouteTester.test(RouteTester.ROUTES.USERS__AUTH, (tester) => {
    const user = UserGenerator();

    tester.beforeAll(async () => {
      await tester.db.table('users').insert([user]);
    });

    tester.afterAll(async () => {
      await tester.db.table('users').where('uuid', user.uuid).delete();
    });

    describe('With good credentials', () => {
      let response: AxiosResponse | null = null;
      const payload = {
        email: user.email,
        password: user.password,
      };

      beforeAll(async () => {
        response = await tester.query(payload);
      });

      it('returns HTTP 200', () => {
        expect(response?.status).toEqual(200);
      });

      it('returns the JWT', async () => {
        const jwt = response?.data?.jwt as string;
        expect(jwt).toEqual(expect.any(String));

        const decoded = await verify(jwt);
        expect(decoded.uuid).toEqual(user.uuid);
        expect(decoded.email).toEqual(user.email);
        expect(decoded.iat).toEqual(expect.any(Number));
      });
    });

    describe('With bad credentials', () => {
      let response: AxiosResponse | null = null;
      const missingUser = UserGenerator();
      const payload = {
        email: missingUser.email,
        password: missingUser.password,
      };

      beforeAll(async () => {
        response = await tester.query(payload);
      });

      it('returns HTTP 403', () => {
        expect(response?.status).toEqual(403);
      });

      it('returns an error list', () => {
        expect(response?.data?.errors).toMatchSnapshot();
      });
    });
  });
});
