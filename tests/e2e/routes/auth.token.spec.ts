import { AxiosResponse } from 'axios';
import { v4 as uuid4 } from 'uuid';

import { App } from '../../../src/server';
import { getDB, query } from '../utils';
import { verify } from '../../../src/auth';

describe('e2e.routes: /auth/token', () => {
  const PORT = 30002;
  const app = new App({
    logging: { quiet: true },
    server: { port: PORT },
  });

  const user = {
    uuid: uuid4(),
    email: `${uuid4()}@dipasqualew.com`,
    password: uuid4(),
  };

  beforeAll(async () => {
    await getDB().table('users').insert([user]);
    await app.listen();
  });

  afterAll(async () => {
    await app.server?.close();
    await getDB().table('users').where('uuid', user.uuid).delete();
  });

  describe('With good credentials', () => {
    let response: AxiosResponse | null = null;
    const payload = {
      email: user.email,
      password: user.password,
    };

    beforeAll(async () => {
      response = await query('/v1/users/auth/jwt', PORT, 'POST', payload);
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
    const payload = {
      email: `${uuid4()}@dipasqualew.com`,
      password: uuid4(),
    };

    beforeAll(async () => {
      response = await query('/v1/users/auth/jwt', PORT, 'POST', payload);
    });

    it('returns HTTP 403', () => {
      expect(response?.status).toEqual(403);
    });

    it('returns an error list', () => {
      expect(response?.data?.errors).toMatchSnapshot();
    });
  });


});
