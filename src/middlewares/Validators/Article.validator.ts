import { checkSchema } from "express-validator"
import { SortDirection } from "mongodb"
import { config } from "~/config"
import { NotASortDirection } from "../Errors/MongoErrors"

export class ArticleValidator {
    static add() {
        return checkSchema({
            brand: {
                in: ['body'],
                isEmpty: {
                    negated: true,
                    errorMessage: "brand is missing",
                    bail: true
                },
            },
            article: {
                in: ['body'],
                isEmpty: {
                    negated: true,
                    errorMessage: "article is missing",
                    bail: true
                },
                custom: {
                    options: (value) => {
                        if (!config.articleType.includes(value as never)) {
                            throw new Error(`Type should be one of ${config.articleType.toString()}`)
                        }
                        return true
                    }
                },
            },
            number: {
                in: ['body'],
                isEmpty: {
                    negated: true,
                    errorMessage: "number is missing",
                    bail: true
                },
            },
            price: {
                in: ['body'],
                isEmpty: {
                    negated: true,
                    errorMessage: "price is missing",
                    bail: true
                },
            }
        })
    }

    static getOne() {
        return checkSchema({
            idArticle: {
                in: ['params'],
                isEmpty: {
                    negated: true,
                    errorMessage: "idArticle is missing",
                    bail: true
                },
            }
        })
    }

    static modifOne() {
        return checkSchema({
            idArticle: {
                in: ['params'],
                isEmpty: {
                    negated: true,
                    errorMessage: "idArticle is missing",
                    bail: true
                },
            },
            brand: {
                in: ['body']
            },
            price: {
                in: ['body']
            },
            article: {
                in: ['body'],
                custom: {
                    options: (value) => {
                        if (value == null) {
                            return true
                        }

                        if (!config.articleType.includes(value as never)) {
                            throw new Error(`Type should be one of ${config.articleType.toString()}`)
                        }
                        return true
                    }
                },
            }
        })
    }
}