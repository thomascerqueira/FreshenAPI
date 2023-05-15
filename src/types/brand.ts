export interface Brand {
    brand: string,
    articles: {
        [key: string] : {
            cost: number,
            coton: number,
            water: number    
        }
    }
}