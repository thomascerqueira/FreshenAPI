import { NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import { SortDirection } from 'mongodb';
import { Article } from '~/services/articleService';
import { RequestWithToken } from '~/types/types';
import { capitalizeFirstLetter } from '~/utils/format';

interface addArticleBody {
  brand: string;
  article: string;
  number: number;
  price: number;
}

interface getAnArticleUserParams {
  idArticle: string;
}

interface modifOneArticleBody {
  brand?: string;
  price?: number;
  article?: string;
}

interface getAllArticle {
  page_number: number;
  page_size: number;
  last_month?: boolean;
  last_year?: boolean;
  price?: SortDirection;
  year?: SortDirection;
}

async function addArticleToUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { brand, article, number, price }: addArticleBody =
    req.body as addArticleBody;
  const { _id } = req.verifiedToken;

  try {
    const insertedIds: string[] = [];
    const date = new Date();
    for (let i = 0; i < number; i++) {
      insertedIds.push(
        (
          await Article.add(
            capitalizeFirstLetter(brand),
            article,
            _id,
            date,
            price,
          )
        ).toString(),
      );
    }
    res.status(200).send({ insertedIds: insertedIds });
  } catch (e) {
    return next(e);
  }
}

async function getAllArticleUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const {
    page_size,
    page_number,
    last_month,
    last_year,
    price,
    year,
  }: getAllArticle = req.query as unknown as getAllArticle;

  try {
    const articles = await Article.getAll(
      _id,
      page_number,
      page_size,
      last_month,
      last_year,
      price,
      year,
    );
    res.status(200).send(articles);
  } catch (e) {
    return next(e);
  }
}

async function getAnArticleUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { idArticle } = req.params as unknown as getAnArticleUserParams;

  try {
    const articles = await Article.getOneArticle(_id, idArticle);
    res.status(200).send(articles);
  } catch (e) {
    return next(e);
  }
}

async function modifOneArticle(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { idArticle } = req.params as unknown as getAnArticleUserParams;
  const { brand, article, price } = req.body as unknown as modifOneArticleBody;

  try {
    const articles = await Article.modifOneArticle(
      _id,
      idArticle,
      brand,
      article,
      price,
    );
    res.status(200).send(articles);
  } catch (e) {
    return next(e);
  }
}

async function deleteOneArticle(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { idArticle } = req.params as unknown as getAnArticleUserParams;

  try {
    const articles = await Article.deleteOneArticle(_id, idArticle);
    res.status(200).send(articles);
  } catch (e) {
    return next(e);
  }
}

export default {
  addArticleToUser,
  getAllArticleUser,
  getAnArticleUser,
  modifOneArticle,
  deleteOneArticle,
};
