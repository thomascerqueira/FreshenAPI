import { ServiceError } from "~/services/Errors/serviceError";

export class NotASortDirection extends ServiceError {
    constructor() {
        super("Sort direction should be one of 'asc' or 'desc' or 'ascending' or 'descending' or 1 or -1")

        Object.setPrototypeOf(this, NotASortDirection.prototype)
    }
}