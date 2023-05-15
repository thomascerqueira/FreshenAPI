import { ServiceError } from "./serviceError";

export class BrandDoesntExist extends ServiceError {
    constructor(brand: string) {
        super("The brand " + brand + " doesn't exists.");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BrandDoesntExist.prototype);
    }
}

export class BrandAlreadyExist extends ServiceError {
    constructor(brand: string) {
        super("The brand " + brand + " already exists.");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BrandAlreadyExist.prototype);
    }
}

export class ArticleNotFindInBrand extends ServiceError {
    constructor(brand: string, article: string) {
        super("The article " + article + " canno't be find in the brand " + brand);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ArticleNotFindInBrand.prototype);
    }
}

export class MissingPhotoIfBrand extends ServiceError {
    constructor() {
        super("Missing photo if you had a brand");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MissingPhotoIfBrand.prototype);
    }
}

export class SameArticleFound extends ServiceError {
    constructor(article: string) {
        super("The article " + article + " has already the same information");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SameArticleFound.prototype);
    }
}
