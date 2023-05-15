import { config } from "~/config"
import { Article } from "~/types/article"
import { getCollection } from "~/utils/mongo"
import { ArticleNotFindInBrand, BrandDoesntExist, SameArticleFound } from "./Errors/gestionArticleServiceError"
import { GestionArticle } from "./gestionArticleService"

export class Suggestion {
    private static async _add(userId: string, brand: string, article: string, price?: number, coton?: number, water?: number, comment?: string): Promise<string> {
        const { insertedId } = await getCollection(config.db_suggestion).insertOne({
            uuid: userId, brand, article, price, comment
        })
        return insertedId.toString()
    }

    static async add(userId: string, brand: string, article: string, price?: number, coton?: number, water?: number, comment?: string) {
        try {
            const _article: Article = await GestionArticle.getArticleInBrand(brand, article)
            if (_article.cost == price || _article.coton == coton || _article.water == water) {
                throw new SameArticleFound(article)
            }
            return await Suggestion._add(userId, brand, article, price, coton, water, comment)
        } catch (error) {
            if (error instanceof BrandDoesntExist || error instanceof ArticleNotFindInBrand) {
                return await Suggestion._add(userId, brand, article, price, coton, water, comment)
            }
            throw error
        }

    }
}