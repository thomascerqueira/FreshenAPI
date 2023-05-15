import { ServiceError } from "./serviceError";

export class RefreshTokenMissing extends ServiceError {
    constructor() {
        super("RefreshTokenMissing");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RefreshTokenMissing.prototype);
    }
}


export class SiretAlreadyUsed extends ServiceError {
    constructor() {
        super("Siret or email already in use");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SiretAlreadyUsed.prototype);
    }
}

export class NotFriperieForEmailSiret extends ServiceError {
    constructor() {
        super("No friperie with this siret and email");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SiretAlreadyUsed.prototype);
    }
}