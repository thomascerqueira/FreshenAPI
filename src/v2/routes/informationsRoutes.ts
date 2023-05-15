import express from "express";
import userController from "~/controllers/userController";

const router = express.Router();
const routerToken = express.Router();

// @ts-ignore
routerToken.get('/my_info', userController.getUserInfoFromToken);

export {
    router,
    routerToken
};