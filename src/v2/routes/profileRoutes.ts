/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import profileController from '~/controllers/profile.controller';
import { RolesHandler } from '~/middlewares/roles.handler';
import { Validator } from '~/middlewares/validators.handler';

const router = express.Router();

/**
 * @api {get} /profile/ Get user's request information
 * @apiName profile
 * @apiGroup Profile
 * @apiVersion 2.0.0
 *
 * @apiSuccess (200) {Object} data
 */
router.get(
  '/',
  RolesHandler.isUser,
  Validator.confirm,
  // @ts-ignore
  profileController.getMineProfile,
);

/**
 * @api {get} /profile/:id Request user profile
 * @apiName userProfile
 * @apiGroup Profile
 * @apiVersion 2.0.0
 *
 * @apiParams {String} user id
 *
 * @apiSuccess (200) {Object} data
 */
router.get(
  '/:id',
  RolesHandler.isUser,
  Validator.confirm,
  profileController.getUserProfile,
);

/**
 * @api {post} /profile/:id/block Block a user
 * @apiName blockProfile
 * @apiGroup Profile
 * @apiVersion 2.0.0
 *
 * @apiParams {String} user id
 *
 * @apiSuccess (200) {Object} data
 */
router.post(
  '/:id/block',
  RolesHandler.isUser,
  Validator.confirm,
  // @ts-ignore
  profileController.blockUserProfile,
);

/**
 * @api {post} /profile/:id/follow Follow a user
 * @apiName followProfile
 * @apiGroup Profile
 * @apiVersion 2.0.0
 *
 * @apiParams {String} user id
 *
 * @apiSuccess (200) {Object} data
 */
router.post(
  '/:id/follow',
  RolesHandler.isUser,
  Validator.confirm,
  // @ts-ignore
  profileController.followUserProfile,
);

/**
 * @api {get} /profile/follow/mine get list of follow
 * @apiName blockProfile
 * @apiGroup Profile
 * @apiVersion 2.0.0
 *
 * @apiSuccess (200) {Object} data
 */
router.get('/follow/mine', RolesHandler.isUser, Validator.confirm);

/**
 * @api {get} /profile/follow/mine get list of followers
 * @apiName blockProfile
 * @apiGroup Profile
 * @apiVersion 2.0.0
 *
 * @apiSuccess (200) {Object} data
 */
router.get('/followers/mine', RolesHandler.isUser, Validator.confirm);

export default router;
