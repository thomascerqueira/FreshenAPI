/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import authController from '~/controllers/authController';
import forgetPasswordController from '~/controllers/forgetPassword';
import {
  AuthValidator,
  ForgetPasswordValidator,
  Validator,
} from '~/middlewares/validators.handler';
const router = express.Router();
const routerToken = express.Router();

router.post(
  '/login',
  AuthValidator.checkLogin(),
  Validator.confirm,
  authController.loginUser,
);

router.post(
  '/register',
  AuthValidator.checkRegister(),
  Validator.confirm,
  authController.registerUser,
);

routerToken.patch(
  '/change_email',
  AuthValidator.checkChangeEmail(),
  Validator.confirm,
  //@ts-ignore
  authController.changeEmail,
);

router.post(
  '/forget_password',
  ForgetPasswordValidator.checkForgetPassword(),
  Validator.confirm,
  forgetPasswordController.generateConfirmLinkForget,
);

router.get(
  '/forget_password/:uid',
  ForgetPasswordValidator.checkSendPageReset(),
  Validator.confirm,
  forgetPasswordController.sendPageReset,
);

router.post(
  '/forget_password/:uid',
  ForgetPasswordValidator.checkChangePassword(),
  Validator.confirm,
  forgetPasswordController.changePassword,
);

routerToken.post(
  '/refresh_token',
  // @ts-ignore
  authController.refreshToken,
);

routerToken.get(
  '/token',
  // @ts-ignore
  authController.getTokenInformation,
);

export { router, routerToken };
