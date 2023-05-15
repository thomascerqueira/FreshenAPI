import { NextFunction, Response } from "express";
import { Suggestion } from "~/services/suggestionService";
import { RequestWithToken } from "~/types/types";
import { capitalizeFirstLetter } from "~/utils/format";

interface addSuggestionBody {
    brand: string,
    article: string,
    price?: number,
    comment?: string,
    coton?: number,
    water?: number
}


async function addSuggestion(req: RequestWithToken, res: Response, next: NextFunction) {
    const { brand, article, price, comment, coton, water }: addSuggestionBody = req.body as addSuggestionBody;
    const { _id } = req.verifiedToken

    try {
        const insertedId = await Suggestion.add(_id, capitalizeFirstLetter(brand), article, price, coton, water, comment)
        res.status(200).send({ insertedId: insertedId })
    } catch (error) {
        return next(error);
    }
}

export default {
    addSuggestion
}