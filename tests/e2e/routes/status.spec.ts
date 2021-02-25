import axios, { AxiosResponse } from 'axios';

import { App } from '../../../src/server';

describe('e2e.routes: /status', () => {
  const PORT = 30001;
  const app = new App({
    logging: { quiet: true },
    server: { port: PORT },
  });

  let response: AxiosResponse | null = null;

  beforeAll(async () => {
    await app.listen();

    response = await axios.get(`http://localhost:${PORT}/v1/status`);
  });

  afterAll(async () => {
    await app.server?.close();
  });

  it('returns HTTP 200', () => {
    expect(response?.status).toEqual(200);
  });

  it('returns the application state', () => {
    expect(response?.data).toMatchSnapshot();
  });

});
