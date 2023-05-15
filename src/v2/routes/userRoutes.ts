/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import {
  PaginationValidator,
  UserValidator,
  Validator,
} from '~/middlewares/validators.handler';
import userController from '../../controllers/userController';

const routerPrincipalToken = express.Router();
const router = express.Router();
const routerToken = express.Router();

router.get(
  '/',
  PaginationValidator.checkPagination(),
  Validator.confirm,
  userController.getAllUsers,
);

router.get(
  '/search/:username',
  UserValidator.searchUserByUsername(),
  Validator.confirm,
  userController.getUser,
);

router.get('/:userId', userController.getOneUser);


routerPrincipalToken.patch(
  '/profile_picture',
  // @ts-ignore
  userController.changeProfilPicture,
);

routerPrincipalToken.patch(
  '/banner',
  // @ts-ignore
  userController.changeBannerPicture,
);

routerPrincipalToken.post(
  '/block',
  UserValidator.blockUnblockUser(),
  Validator.confirm,
  // @ts-ignore
  userController.blockOtherUser,
);

routerPrincipalToken.post(
  '/unblock',
  UserValidator.blockUnblockUser(),
  Validator.confirm,
  // @ts-ignore
  userController.unblockOtherUser,
);

routerPrincipalToken.patch(
  '/username',
  UserValidator.changeUsername(),
  Validator.confirm,
  //@ts-ignore
  userController.changeUsername,
);

routerPrincipalToken.patch(
  '/description',
  UserValidator.changeDescription(),
  Validator.confirm,
  //@ts-ignore
  userController.changeDescription,
);


routerToken.post(
  '/follow/:userId',
  UserValidator.follow(),
  Validator.confirm,
  // @ts-ignore
  userController.followUser,
);

routerToken.delete(
  '/follow/:userId',
  UserValidator.follow(),
  Validator.confirm,
  // @ts-ignore
  userController.unfollowUser,
);

router.patch('/:userId', userController.updateOneUser);

router.get(
  '/follow/:userId',
  UserValidator.follow(),
  Validator.confirm,
  // @ts-ignore
  userController.getFollow,
);

router.delete(
  '/:userId',
  UserValidator.delete(),
  Validator.confirm,
  userController.deleteOneUser,
);

router.post(
  '/block/:userId',
  UserValidator.checkBlock(),
  Validator.confirm,
  userController.blockUser,
);

routerPrincipalToken.get(
  '/favoris',
  // @ts-ignore
  userController.getFavoris,
);

routerToken.post(
  '/favoris/:friperieId',
  UserValidator.favoris(),
  Validator.confirm,
  // @ts-ignore
  userController.addFavoris,
);

routerToken.delete(
  '/favoris/:friperieId',
  UserValidator.favoris(),
  Validator.confirm,
  // @ts-ignore
  userController.deleteFavoris,
);

export { router, routerToken, routerPrincipalToken };
