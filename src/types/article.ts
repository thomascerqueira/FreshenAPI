export interface Article {
    cost: number,
    coton: number,
    water: number
}

export interface ArticleUser {
    uid: string,
    brand: string,
    article: string,
    price: number,
    time: Date
}