/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { toString } from 'lodash';
import { ServiceError } from '~/services/Errors/serviceError';
import { ApiException } from '~/types/exceptions';
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '~/utils/exceptions';
import { logger } from '~/utils/winston';

function createNotFound(error: ServiceError): ApiException {
  return new NotFoundException(error.message);
}

function createConflict(error: ServiceError): ApiException {
  return new ConflictException(error.message)
}

function createBadRequest(error: ServiceError): ApiException {
  return new BadRequestException(error.message)
}

function createUnauthorized(error: ServiceError): ApiException {
  return new UnauthorizedException("Unauthorized")
}

let mapError: Map<string, (error: ServiceError) => ApiException> = new Map<string, (error: ServiceError) => ApiException>(
  [
    ["BrandDoesntExist", createNotFound],
    ["BrandAlreadyExist", createConflict],
    ["ArticleNotFindInBrand", createNotFound],
    ["MissingPhotoIfBrand", createBadRequest],
    ["SameArticleFound", createConflict],
    ["RefreshTokenMissing", createUnauthorized],
    ["FriperieDoesntExists", createNotFound],
    ["AvisFriperiesDoesntExist", createNotFound],
    ["SiretAlreadyUsed", createConflict],
    ["NotFriperieForEmailSiret", createNotFound]
  ]
)

/**
 * Global error handling middleware
 *
 * @param err - The Express error (may be ours or another)
 * @param req - The initial request
 * @param res - The response object
 * @param next - Allows you to switch to the next middleware if existing
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const ExceptionsHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /**
   * Voir "The default error handler" dans la doc officielle indiquée plus haut
   */
  if (res.headersSent) {
    return next(err);
  }



  if (err instanceof ServiceError) {
    const functionError = mapError.get(err.constructor.name)

    if (functionError) {
      const error = functionError(err)

      logger.error(toString(err))
      return res.status(error.status).json({ error: error.error });
    } else {
      logger.error(toString(err))
      return res.status(500).json({ error: 'Internal server error', details: toString(err) });
    }
  }

  // /**
  //  * Si c'est le cas, on sait que c'est notre propre erreur
  //  */
  if (err.status && err.error) {
    logger.error(toString(err.error));
    return res.status(err.status).json({ error: err.error });
  }

  /**
   * Dans les autres cas, on retourne une 500
   */
  console.error(err)
  logger.error(toString(err));
  return res.status(500).json({ error: 'Internal server error', details: toString(err) });
};
