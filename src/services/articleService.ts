import { GestionArticle } from './gestionArticleService';
import { getCollection, toObjectId } from "~/utils/mongo";
import { config } from "~/config";
import { ArticleUser } from "~/types/article";
import { getUser } from "~/utils/user";
import { SortDirection } from 'mongodb';

export class Article {
    static async add(brand: string, article: string, uid: string, time: Date, price: number) {
        await getUser(uid)
        await GestionArticle.getArticleInBrand(brand, article);

        const { insertedId } = await getCollection(config.db_articles).insertOne({
            uid: uid,
            brand: brand,
            article: article,
            price: price,
            time: time
        })
        return insertedId.toString()
    }

    static async getAll(uid: string, page: number = 0, pageSize: number = 20, month: boolean = false, year: boolean = false,
        price?: SortDirection,
        time?: SortDirection) {
        await getUser(uid)

        let maxDate = new Date()

        if (month) {
            maxDate.setMonth(maxDate.getMonth() - 1)
        }

        if (year) {
            maxDate.setFullYear(maxDate.getFullYear() - 1)
        }

        return await getCollection(config.db_articles)
            .find({
                uid: uid,
                ...((month || year) && {
                    time: {
                        $gte: maxDate
                    }
                })
            })
            .sort(
                {
                    ...((price && { price: price }) || {}),
                    ...((time && { time: time }) || {})
                }
            )
            .skip(page * pageSize)
            .limit(pageSize)
            .toArray() as unknown as Array<ArticleUser>
    }

    static async getOneArticle(uid: string, idArticle: string): Promise<ArticleUser> {
        await getUser(uid)

        return await getCollection(config.db_articles).findOne({
            uid: uid,
            _id: toObjectId(idArticle)
        }) as unknown as ArticleUser
    }

    static async modifOneArticle(uid: string, idArticle: string, brand?: string, article?: string, price?: number) {
        await getUser(uid)

        const _article: ArticleUser = await this.getOneArticle(uid, idArticle)

        brand = brand ? brand : _article.brand;
        article = article ? article : _article.article;
        price = price !== undefined ? price : _article.price;

        await getCollection(config.db_articles).updateOne(
            {
                uid: uid,
                _id: toObjectId(idArticle)
            },
            {
                $set: { brand, article, price }
            }
        )
    }

    static async deleteOneArticle(uid: string, idArticle: string) {
        await getUser(uid)

        await getCollection(config.db_articles).deleteOne(
            {
                uid: uid,
                _id: toObjectId(idArticle)
            }
        )
    }
}