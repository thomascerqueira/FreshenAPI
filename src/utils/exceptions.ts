import { ValidationError } from 'express-validator';
import { ApiException } from '~/types/exceptions';

/**
 * Generic class that is used to create HTTP errors
 *
 * We specify that our class must correspond to the `ApiException` interface
 *
 * The `readonly` keywords serve as a shorthand for `this.property=value`,
 * they also prevent us from changing these values later.
 *
 * Here `this.error = error` and `this.status = status`
 */
export class Exception implements ApiException {
  constructor(
    readonly error: string | Array<ValidationError>,
    readonly status: number,
  ) { }
}

export class UnauthorizedException extends Exception {
  constructor(error: string | Array<ValidationError>) {
    super(error, 406);
  }
}

/**
 * 400 error creation
 */
export class BadRequestException extends Exception {
  /**
   * We call the `constructor` of the parent class `Exception`
   */
  constructor(error: string | Array<ValidationError>) {
    super(error, 400);
  }
}

/**
 * 403 error creation
 */
export class ForbiddenException extends Exception {
  /**
   * We call the `constructor` of the parent class `Exception`
   */
  constructor(error: string | Array<ValidationError>) {
    super(error, 403);
  }
}

/**
 * 404 error creation
 */
export class NotFoundException extends Exception {
  /**
   * We call the `constructor` of the parent class `Exception`
   */
  constructor(error: string | Array<ValidationError>) {
    super(error, 404);
  }
}

export class ConflictException extends Exception {
  constructor(error: string | Array<ValidationError>) {
    super(error, 409);
  }
}