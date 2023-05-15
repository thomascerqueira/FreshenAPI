import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { config } from '~/config';
import { BrandAlreadyExist } from '~/services/Errors/gestionArticleServiceError';
import { GestionArticle } from '~/services/gestionArticleService';
import { BadRequestException, ConflictException } from '~/utils/exceptions';
import { capitalizeFirstLetter, getFiles } from '~/utils/format';

interface AddBrandBody {
    brand: string
}

interface GetBrandParams {
    brand: string
}

interface ChangePhotoBrand {
    brand: string
}

interface GetArticleInBrandParams {
    brand: string,
    article: string
}

interface DeleteArticle {
    brand: string,
    article: string
}

interface DeleteBrand {
    brand: string
}

interface AddArticleToBrandParams {
    brand: string,
    article: string
}

interface AddArticleToBrandBody {
    cost: number,
    coton: number,
    water: number
}


async function addBrand(req: Request, res: Response, next: NextFunction) {
    const { brand }: AddBrandBody = req.body;

    try {
        const files = getFiles(req) as any[]
        const insertedId = await GestionArticle.addBrand(capitalizeFirstLetter(brand), files[0])
        res.status(200).send({ "insertedId": insertedId })
    } catch (error) {
        return next(error)
    }
}

async function getAllBrand(req: Request, res: Response, next: NextFunction) {
    try {
        const brands = await GestionArticle.getAllBrand()
        res.status(200).send(brands)
    } catch (error) {
        return next(error)
    }
}

async function getBrand(req: Request, res: Response, next: NextFunction) {
    const { brand }: GetBrandParams = req.params as unknown as GetBrandParams;

    try {
        const _brand = await GestionArticle.getBrand(capitalizeFirstLetter(brand))
        res.status(200).send(_brand)
    } catch (error) {
        return next(error)
    }
}

async function getArticlePhoto(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).send({ photos: config.photosArticle })
    } catch (error) {
        return next(error)
    }
}

async function changePhotoBrand(req: Request, res: Response, next: NextFunction) {
    const { brand }: ChangePhotoBrand = req.params as unknown as ChangePhotoBrand

    try {
        const files = getFiles(req) as any[]
        await GestionArticle.changePhoto(capitalizeFirstLetter(brand), files[0])
        res.status(200).send()
    } catch (error) {
        return next(error)
    }
}

async function addArticleToBrand(req: Request, res: Response, next: NextFunction) {
    const { cost, coton, water }: AddArticleToBrandBody = req.body;
    const { brand, article }: AddArticleToBrandParams = req.params as unknown as AddArticleToBrandParams

    try {
        const files = getFiles(req, true)
        await GestionArticle.addArticleToBrand(capitalizeFirstLetter(brand), article, cost, coton, water, files ? files[0] : null)
        res.status(200).send()
    } catch (error) {
        return next(error)
    }
}

async function getArticleInBrand(req: Request, res: Response, next: NextFunction) {
    const { brand, article }: GetArticleInBrandParams = req.params as unknown as GetArticleInBrandParams

    try {
        const _article = await GestionArticle.getArticleInBrand(capitalizeFirstLetter(brand), article)
        res.status(200).send(_article)
    } catch (error) {
        return next(error)
    }
}

async function deleteArticle(req: Request, res: Response, next: NextFunction) {
    const { brand, article }: DeleteArticle = req.params as unknown as DeleteArticle

    try {
        await GestionArticle.deleteArticle(capitalizeFirstLetter(brand), article)
        res.status(200).send()
    } catch (error) {
        return next(error)
    }
}

async function deleteBrand(req: Request, res: Response, next: NextFunction) {
    const { brand }: DeleteBrand = req.params as unknown as DeleteBrand

    try {
        await GestionArticle.deleteBrand(capitalizeFirstLetter(brand))
        res.status(200).send()
    } catch (error) {
        return next(error)
    }
}

export default {
    addBrand,
    getBrand,
    getArticlePhoto,
    addArticleToBrand,
    getAllBrand,
    getArticleInBrand,
    deleteArticle,
    deleteBrand,
    changePhotoBrand
}