import express from "express";
import { getActualiteFriperie, getActualiteUser } from "~/controllers/actualiteController";

const routerToken = express.Router();


routerToken.get(
    "/friperie",
    // @ts-ignore
    getActualiteFriperie
)

routerToken.get(
    "/user",
    // @ts-ignore
    getActualiteUser
)

export {
    routerToken
}