import { ServiceError } from "./serviceError";

export class FriperieDoesntExists extends ServiceError {
    constructor(friperie: string) {
        super("The friperie " + friperie + " doesn't exists.");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, FriperieDoesntExists.prototype);
    }
}

export class AvisFriperiesDoesntExist extends ServiceError {
    constructor(friperie: string, user: string) {
        super("The friperie " + friperie + " doesn't have id for " + user);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AvisFriperiesDoesntExist.prototype);
    }
}