/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import friperiesController from '~/controllers/friperiesController';
import { RolesHandler } from '~/middlewares/roles.handler';
import {
  FriperiesValidator,
  Validator,
} from '~/middlewares/validators.handler';

const router = express.Router();
const routerToken = express.Router();

router.post(
  '/',
  FriperiesValidator.CreateFriperie(),
  Validator.confirm,
  friperiesController.createFriperie,
);

router.get('/', friperiesController.getAllFriperie);

router.get(
  '/:friperieId',
  FriperiesValidator.GetFriperie(),
  Validator.confirm,
  friperiesController.getFriperie,
);

router.get(
  '/:id/avis',
  FriperiesValidator.Avis(),
  Validator.confirm,
  friperiesController.getAllAvis,
);

router.get(
  '/:id/avis/:userId',
  FriperiesValidator.Avis(),
  Validator.confirm,
  friperiesController.getAvis,
);

routerToken.patch(
  '/',
  FriperiesValidator.UpdateFriperie(),
  Validator.confirm,
  // @ts-ignore
  friperiesController.updateFriperie,
);

routerToken.patch(
  '/:id',
  // @ts-ignore
  RolesHandler.isAdmin,
  FriperiesValidator.UpdateFriperie(),
  Validator.confirm,
  // @ts-ignore
  friperiesController.updateFriperieAdmin,
);

routerToken.patch(
  '/photo',
  // @ts-ignore
  friperiesController.updatePhotoFriperie,
);

routerToken.delete(
  '/:id/avis/:userId',
  FriperiesValidator.Avis(),
  Validator.confirm,
  // @ts-ignore
  friperiesController.deleteAvis,
);

routerToken.post(
  '/:id/avis',
  FriperiesValidator.LetAvis(),
  Validator.confirm,
  // @ts-ignore
  friperiesController.letAvis,
);

routerToken.patch(
  '/:id/avis',
  FriperiesValidator.LetAvis(),
  Validator.confirm,
  // @ts-ignore
  friperiesController.letAvis,
);

export { router, routerToken };
