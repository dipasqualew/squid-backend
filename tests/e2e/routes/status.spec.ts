import { AxiosResponse } from 'axios';

import { ROUTES } from '../../../src/routes/config';
import { RouteTester } from '../utils';

describe('e2e.routes.status', () => {
  RouteTester.test(ROUTES.STATUS, (tester) => {
    let response: AxiosResponse | null = null;

    tester.beforeAll(async () => {
      response = await tester.query();
    });

    tester.afterAll();

    it('returns HTTP 200', () => {
      expect(response?.status).toEqual(200);
    });

    it('returns the application state', () => {
      expect(response?.data).toMatchSnapshot();
    });
  });
});
