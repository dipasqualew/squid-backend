import jwt from 'jsonwebtoken';

export const SECRET = 'test';

export interface Claim {
  uuid: string;
  email: string;
  iat?: number;
}

export const isClaim = (obj: unknown): obj is Claim => {
  if (typeof obj !== 'object') {
    return false;
  }

  if (!obj) {
    return false;
  }

  return ('uuid' in obj) && ('email' in obj);
};

export const sign = (claim: Claim): Promise<string> => new Promise((resolve, reject) => {
  jwt.sign({ uuid: claim.uuid, email: claim.email }, SECRET, { algorithm: 'HS256' }, (err, token) => {
    if (err || !token) {
      return reject(err);
    }

    return resolve(token);
  });
});

export const verify = (token: string): Promise<Claim> => new Promise((resolve, reject) => {
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || !decoded) {
      return reject(err);
    }

    if (!isClaim(decoded)) {
      const error = new Error('Invalid JWT.');
      return reject(error);
    }

    return resolve(decoded);
  });
});
