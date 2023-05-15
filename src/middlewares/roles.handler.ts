import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '~/utils/exceptions';
import { logger } from '~/utils/winston';

function checkRoles(roles: Array<string>, wantedRoles: string) {
  logger.info('Checking user roles');
  return roles.includes(wantedRoles);
}

export class RolesHandler {
  /**
   * isUser Management Middleware
   *
   * @param req - The initial request
   * @param res - The response object
   * @param next - Allows you to switch to the next middleware if existing
   */
  static isUser(req: Request, res: Response, next: NextFunction) {
    const token = req['verifiedToken'];
    if (!token.roles || !checkRoles(token.roles, 'freshen:user'))
      throw new ForbiddenException("You don't have access to this resource");
    logger.info('Access granted to the requested resources');
    next();
  }

  /**
   * isAdmin Management Middleware
   *
   * @param req - The initial request
   * @param res - The response object
   * @param next - Allows you to switch to the next middleware if existing
   */
  static isAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req['verifiedToken'];
    if (!checkRoles(token.roles, 'freshen:admin'))
      throw new ForbiddenException("You don't have access to this resource");
    logger.info('Access granted to the requested resources');
    next();
  }
}
