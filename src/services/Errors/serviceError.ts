export class ServiceError extends Error {
    constructor(error: string) {
        super(error);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}