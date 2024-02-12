// Types
import ERROR_MESSAGES from "../constants/errorMessages";
import { IValidationError } from "../types";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
  }

  abstract serializeErrors(): { message: string }[];
}

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class InternalServerError extends CustomError {
  statusCode = 500;

  constructor(message: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: ERROR_MESSAGES.generic.internalServerError }];
  }
}

export class ValidationError extends CustomError {
  statusCode = 400;
  errors: IValidationError[];

  constructor(errors: IValidationError[]) {
    super(`Validation errors: ${JSON.stringify(errors)}`);

    this.errors = errors;
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return {
        message: err.message,
        field: err.field,
      };
    });
  }
}

export class AuthenticationError extends CustomError {
  statusCode = 401;

  constructor(message = ERROR_MESSAGES.generic.authenticationError) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(message?: string) {
    super(message ?? ERROR_MESSAGES.generic.forbiddenError);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
