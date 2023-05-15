/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import articleController from '~/controllers/articleController';
import { ArticleValidator, Validator } from '~/middlewares/validators.handler';

const router = express.Router();

const {
  addArticleToUser,
  getAllArticleUser,
  getAnArticleUser,
  modifOneArticle,
  deleteOneArticle,
} = articleController;

router.post(
  '/',
  ArticleValidator.add(),
  Validator.confirm,
  // @ts-ignore
  addArticleToUser,
);

router.get(
  '/',
  // @ts-ignore
  getAllArticleUser,
);

router.get(
  '/:idArticle',
  ArticleValidator.getOne(),
  Validator.confirm,
  // @ts-ignore
  getAnArticleUser,
);

router.patch(
  '/:idArticle',
  ArticleValidator.modifOne(),
  Validator.confirm,
  // @ts-ignore
  modifOneArticle,
);

router.delete(
  '/:idArticle',
  ArticleValidator.getOne(),
  Validator.confirm,
  // @ts-ignore
  deleteOneArticle,
);

export default router;
