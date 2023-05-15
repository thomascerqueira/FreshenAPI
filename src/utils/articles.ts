import { config } from "~/config"
import { getUrlPhoto } from "~/services/photos";
import { getCollection } from "./mongo"

async function generateLinkArticlePhoto() {
    const articles = await getCollection(config.db_types_article).find().toArray()
    let result: string[] = []
    const types = articles[0].types

    config.articleType = types
    const storage = config.storage

    for (const i in types) {
        const url = await getUrlPhoto( `Articles/${types[i]}.png`, storage)
        result.push(url)
    }

    return result
}

export {
    generateLinkArticlePhoto
}