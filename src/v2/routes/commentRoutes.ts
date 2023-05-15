import express from 'express';
import commentController from '~/controllers/commentController';
import { RolesHandler } from '~/middlewares/roles.handler';
import {
  PaginationValidator,
  Validator,
} from '~/middlewares/validators.handler';

const router = express.Router();

/**
 * @api {get} /comment Request comment list
 * @apiName getComments
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiQuery {Number{0..}} page
 * @apiQuery {Number{0..100}} pageSize
 * @apiQuery {String} userId (optional)
 *
 * @apiSuccess (200) {Number} count
 * @apiSuccess (200) {Object[]} data
 */
router.get(
  '/',
  RolesHandler.isAdmin,
  PaginationValidator.checkPagination(),
  Validator.confirm,
  commentController.getAllComment,
);

/**
 * @api {get} /comment/:id Request comment list from a post
 * @apiName getComment
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiQuery {Number{0..}} page
 * @apiQuery {Number{0..100}} pageSize
 * @apiParams {String} post id
 *
 * @apiSuccess (200) {Object} data
 */
router.get(
  '/:id',
  RolesHandler.isUser,
  Validator.confirm,
  commentController.getFromPost,
);

/**
 * @api {get} /comment/:id/reply Request reply list from a comment
 * @apiName getComment
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiQuery {Number{0..}} page
 * @apiQuery {Number{0..100}} pageSize
 * @apiParams {String} comment id
 *
 * @apiSuccess (200) {Object} data
 */
router.get(
  '/:id/reply',
  RolesHandler.isUser,
  Validator.confirm,
  commentController.getReplyFromComment,
);

/**
 * @api {post} /comment Create a comment
 * @apiName createComment
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiBody {String} post id
 * @apiBody {String} message
 * @apiBody {String} comment id (optional)
 *
 * @apiSuccess (200) {String} comment Id
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
router.post('/', RolesHandler.isUser, commentController.createComment);

/**
 * @api {put} /comment/:id Update a comment
 * @apiName updateComment
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiParams {String} comment id
 * @apiBody {String} comment id
 *
 * @apiSuccess (200)
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
router.put('/:id', RolesHandler.isUser, commentController.updateComment);

/**
 * @api {delete} /comment/:id Delete a comment
 * @apiName deleteComment
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiParams {String} post id
 *
 * @apiSuccess (200)
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
router.delete('/:id', RolesHandler.isUser, commentController.deleteComment);

/**
 * @api {delete} /comment/:id Delete a comment
 * @apiName deleteComment
 * @apiGroup Comment
 * @apiVersion 2.0.0
 *
 * @apiParams {String} comment id
 * @apiBody {String} user id
 *
 * @apiSuccess (200)
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.post('/:id/like', RolesHandler.isUser, commentController.likeComment);

export default router;
