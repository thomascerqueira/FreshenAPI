import express from "express";
import gestionArticleController from "~/controllers/gestionArticleController";
import { GestionArticleValidator, Validator } from "~/middlewares/validators.handler";

const router = express.Router()

router.post(
    '/brand',
    GestionArticleValidator.addBrand(),
    Validator.confirm,
    gestionArticleController.addBrand
)

router.patch(
    "/:brand/photo",
    GestionArticleValidator.changePhoto(),
    Validator.confirm,
    gestionArticleController.changePhotoBrand
)

 router.get(
    '/brand',
    Validator.confirm,
    gestionArticleController.getAllBrand
)


router.get(
    '/brand/:brand',
    GestionArticleValidator.getBrand(),
    Validator.confirm,
    gestionArticleController.getBrand
)

router.delete(
    '/brand/:brand',
    GestionArticleValidator.getBrand(),
    Validator.confirm,
    gestionArticleController.deleteBrand
)

router.post(
    '/:brand/:article',
    GestionArticleValidator.addArticleToBrand(),
    Validator.confirm,
    gestionArticleController.addArticleToBrand
)

router.patch(
    '/:brand/:article',
    GestionArticleValidator.addArticleToBrand(),
    Validator.confirm,
    gestionArticleController.addArticleToBrand
)

router.get(
    '/:brand/:article',
    GestionArticleValidator.getArticleInBrand(),
    Validator.confirm,
    gestionArticleController.getArticleInBrand
)

router.delete(
    '/:brand/:article',
    GestionArticleValidator.getArticleInBrand(),
    Validator.confirm,
    gestionArticleController.deleteArticle
)


router.get(
    '/photos_article',
    Validator.confirm,
    gestionArticleController.getArticlePhoto
)

export default router
