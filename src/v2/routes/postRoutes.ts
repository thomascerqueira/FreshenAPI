/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import { PostValidator, Validator } from '~/middlewares/validators.handler';
import postController from '../../controllers/postController';

const router = express.Router();

const { createPost, getPost, likePost, deletePost, deleteAllPost, getAllPost } =
  postController;

router.post('/', PostValidator.createPost(), Validator.confirm, createPost);

// @ts-ignore
router.get('/:postId', PostValidator.getPost(), Validator.confirm, getPost);

// @ts-ignore
router.get('/', getAllPost);

router.delete(
  '/:postId',
  PostValidator.delete(),
  Validator.confirm,
  // @ts-ignore
  deletePost,
);

// @ts-ignore
router.post('/:postId/like', PostValidator.like(), Validator.confirm, likePost);

// @ts-ignore
router.delete('/', deleteAllPost);

export default router;
