import { resetMongo } from "../src/utils/handleTest"
import { closeDb, run } from "../src/utils/mongo"
import { GestionArticle } from "../src/services/gestionArticleService"
import { ArticleNotFindInBrand, BrandAlreadyExist, BrandDoesntExist } from "../src/services/Errors/gestionArticleServiceError"

describe("Gestion Articles", () => {
    const nameBrand = "test"
    const nameBrand2 = "test2"
    const water = 3
    const coton = 2
    const cost = 1
    const article = "jean"
    const photo = {
        name: "1.jpg"
    }

    beforeAll(async () => {
        await run()
        await resetMongo()
    })

    afterAll(async () => {
        await closeDb()
    })

    test("It should throw an error because brand doesn't exits", () => {
        return expect(GestionArticle.getBrand(nameBrand)).rejects.toThrow(BrandDoesntExist)
    })

    test("It should create two brand", async () => {
        await GestionArticle.addBrand(nameBrand, photo)
        await GestionArticle.addBrand(nameBrand2, photo)
    })

    test("It should throw because the brand already exist", () => {
        return expect(GestionArticle.addBrand(nameBrand, photo)).rejects.toThrow(BrandAlreadyExist)
    })

    test("It should get the brand without anything in it", async () => {
        const test = await GestionArticle.getBrand(nameBrand)

        expect(test.articles).toEqual({});
        expect(test.brand).toEqual(nameBrand)
    })

    test("It should get two brand", async () => {
        expect((await GestionArticle.getAllBrand()).length).toEqual(2)
    })

    test("It should add an article", async () => {
        await GestionArticle.addArticleToBrand(nameBrand, article, cost, coton, water)
    })

    test("It should get the right article with the right value", async () => {
        const _article = await GestionArticle.getArticleInBrand(nameBrand, article)

        expect(_article).toEqual({
            "coton": coton,
            "water": water,
            "cost": cost
        })
    })

    test("It should throw an error because this brand doesn't have this article", () => {
        expect(GestionArticle.getArticleInBrand(nameBrand, "short")).rejects.toThrow(ArticleNotFindInBrand)
    })

    test("It should delete an article", async () => {
        await GestionArticle.deleteArticle(nameBrand, article)
    })

    test("It should see that test brand doesnt have article", async () => {
        const brand = await GestionArticle.getBrand(nameBrand)

        expect(brand.articles).toEqual({})
    })

    test("It should delete a brand", async () => {
        await GestionArticle.deleteBrand(nameBrand)
    })

    test("It should throw because the brand doesn't exist", () => {
        return expect(GestionArticle.getBrand(nameBrand)).rejects.toThrow(BrandDoesntExist)
    })
})