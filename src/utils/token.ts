import { Response } from 'express';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import { config } from '~/config';

export class Token {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static create(payloadToSign: any) {
    return jwt.sign(payloadToSign, config.privateKey, {
      expiresIn: config.tokenExpirationTime,
    });
  }

  static createRefreshToken(id: string) {
    return jwt.sign({ _id: id }, config.privateKey, { expiresIn: "1d" })
  }

  static decode(token: string) {
    return jwt.decode(token);
  }

  static verify(token: string, options: VerifyOptions = {}) {
    return jwt.verify(token.split(' ')[1], config.privateKey, options);
  }
}
