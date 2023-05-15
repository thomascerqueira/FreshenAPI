import { Request } from 'express';
import { NotFoundException } from '~/utils/exceptions';

/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
export const UnknownRoutesHandler = (req: Request) => {
  throw new NotFoundException("The requested resource doesn't exist " + req.url);
};
