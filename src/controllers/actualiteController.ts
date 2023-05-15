import { NextFunction, Response } from 'express';
import { Actualite } from '~/services/actualite';
import { RequestWithToken } from '~/types/types';

interface GetFriperieActualite {
  page: number;
  page_size: number;
}

async function getActualiteFriperie(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { page, page_size }: GetFriperieActualite =
    req.query as unknown as GetFriperieActualite;

  try {
    const post = await Actualite.getActualiteFriperie(_id, page, page_size);

    res.status(200).send(post);
  } catch (error) {
    return next(error);
  }
}

async function getActualiteUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { page, page_size }: GetFriperieActualite =
    req.query as unknown as GetFriperieActualite;

  try {
    const post = await Actualite.getActualiteFriperie(_id, page, page_size);

    res.status(200).send(post);
  } catch (error) {
    return next(error);
  }
}

export { getActualiteFriperie, getActualiteUser };
