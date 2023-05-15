import { config } from "~/config";
import { Article } from "~/types/article";
import { Brand } from "~/types/brand";
import { getCollection } from "~/utils/mongo";
import { addPhotoFromByteArray, deleteBucketDirectory, getUrlPhoto } from "./photos";
import { ref } from "firebase/storage"
import { ArticleNotFindInBrand, BrandAlreadyExist, BrandDoesntExist, MissingPhotoIfBrand } from "./Errors/gestionArticleServiceError";


export class GestionArticle {
    /**
     * Add a brand in the DB
     * @param brand Name of the brand
     * @returns 
     */
    static async addBrand(brand: string, photo: any) {
        const collection = getCollection(config.db_info_articles)
        const _brand = await collection.findOne({
            brand: brand
        })

        if (_brand) {
            throw new BrandAlreadyExist(brand);
        }

        const url = await this.addPhoto(brand, photo)

        const { insertedId } = await collection.insertOne({
            brand: brand,
            photo: url,
            articles: {}
        })

        return insertedId
    }

    /**
     * Add photo to the brand
     * @param brand
     * @param photo 
     * @returns 
     */
    static async addPhoto(brand: string, photo: any): Promise<string> {
        const path: string = "photo" + "." + photo.name.split(".").pop()
        const directory: string = `brands/${brand}`
        await addPhotoFromByteArray(directory, path, new Uint8Array(photo.data))
        const url: string = await getUrlPhoto(path, ref(config.storage, directory))

        return url
    }

    /**
     * Change photo of the brand
     * @param brand 
     * @param photo 
     */
    static async changePhoto(brand: string, photo: any) {
        const directory: string = `brands/${brand}`

        try {
            await deleteBucketDirectory(directory)
        } catch (error) {
            console.error(error)
        }

        const url = await this.addPhoto(brand, photo)
        await this.updateUrlPhoto(brand, url)
    }

    /**
     * Update the url of the photo of the brand
     * @param brand 
     * @param url 
     */
    private static async updateUrlPhoto(brand: string, url: string) {
        await getCollection(config.db_info_articles).updateOne({
            brand: brand
        }, {
            $set: {
                photo: url
            }
        })
    }

    /**
     * Get all brand in the DB
     * @returns All brand
     */
    static async getAllBrand() {
        return await getCollection(config.db_info_articles).find().toArray()
    }


    /**
     * Get articles and informations for a brand
     * If there is no brand it will throw
     * @param brand name of the brand
     * @returns the brand
     */
    static async getBrand(brand: string): Promise<Brand> {
        const _brand = await getCollection(config.db_info_articles).findOne(
            { brand: brand }
        ) as unknown as Brand

        if (!_brand) {
            throw new BrandDoesntExist(brand)
        }

        return _brand
    }

    /**
     * Add an article to a brand
     * If the brand doesn't exist it will be created
     * @param brand name of the brand
     * @param article name of the article
     * @param cost cost of the article
     * @param coton coton cost of the article
     * @param water water cost of the article
     */
    static async addArticleToBrand(brand: string, article: string, cost: number, coton: number, water: number, photo?: any) {
        let url = ""

        try {
            await this.getBrand(brand)
        } catch (error) {
            if (!photo) {
                throw new MissingPhotoIfBrand();
            }

            url = await this.addPhoto(brand, photo)
        }

        await getCollection(config.db_info_articles).updateOne({
            brand: brand
        }, {
            $set: {
                [`articles.${article}`]: {
                    cost,
                    coton,
                    water
                }
            }

        }, { upsert: true })

        if (url !== "") {
            await this.updateUrlPhoto(brand, url)
        }
    }

    /**
     * Get information of the article
     * If the brand doesn't exist or the article isn't in the brand it will throw an error
     * @param brand name of the brand
     * @param article name of the article
     * @returns information of the article
     */
    static async getArticleInBrand(brand: string, article: string): Promise<Article> {
        const _brand: Brand = await this.getBrand(brand)

        if (!Object.keys(_brand.articles).includes(article)) {
            throw new ArticleNotFindInBrand(brand, article)
        }

        return _brand.articles[article]
    }

    /**
     * Delete an article in a brand
     * @param brand name of the brand
     * @param article name of the article
     */
    static async deleteArticle(brand: string, article: string) {
        await getCollection(config.db_info_articles).updateOne({
            brand: brand
        }, {
            $unset: {
                [`articles.${article}`]: 1
            }
        })
    }

    /**
     * Delete a brand
     * @param brand Name of the brand
     */
    static async deleteBrand(brand: string) {
        await getCollection(config.db_info_articles).deleteOne({
            brand: brand
        })
    }
}