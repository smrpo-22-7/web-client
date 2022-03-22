import { BaseError } from "@mjamsek/prog-utils";

export class BadRequestError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, BadRequestError, cause);
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, NotFoundError, cause);
    }
}

export class ValidationError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, ValidationError, cause);
    }
}

export class ConflictError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, ConflictError, cause);
    }
}

export class InternalServerError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, InternalServerError, cause);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, UnauthorizedError, cause);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string, cause?: Error) {
        super(message, ForbiddenError, cause);
    }
}

export interface PageError {
    status: string;
    title: string;
    description: string;
}
