import type { Method } from 'axios';

export interface Route {
  method: Method;
  path: string;
  label: string;
}

export const route = (method: Method, path: string): Route => ({
  method,
  path,
  label: `${method} ${path}`,
});

export const ROUTES = {
  SQUIDS__DELETE: route('DELETE', '/v1/squids/:uuid'),
  SQUIDS__DETAIL: route('GET', '/v1/squids/:uuid'),
  SQUIDS__LIST: route('GET', '/v1/squids'),
  SQUIDS__PUT: route('PUT', '/v1/squids'),
  STATUS: route('GET', '/v1/status'),
  USERS__AUTH: route('POST', '/v1/users/auth'),
};
