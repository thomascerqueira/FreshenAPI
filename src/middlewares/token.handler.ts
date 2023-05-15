/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '~/utils/exceptions';
import { Token } from '~/utils/token';

/**
 * Token Management Middleware
 *
 * @param req - The initial request
 * @param res - The response object
 * @param next - Allows you to switch to the next middleware if existing
 *
 * @see https://www.npmjs.com/package/jsonwebtoken
 */
export const TokenHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.get('authorization');
  if (!token) throw new ForbiddenException('Token is missing');

  let verifiedToken;
  try {
    verifiedToken = Token.verify(token);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError')
      return next(new ForbiddenException('Token expired'));
    if (err.name === 'JsonWebTokenError')
      return next(new ForbiddenException('Wrong signature'));
    if (err.name === 'NotBeforeError')
      return next(new ForbiddenException('Token not active'));
    return next(new ForbiddenException(err));
  }
  req['token'] = token;
  req['verifiedToken'] = verifiedToken;
  next();
};
