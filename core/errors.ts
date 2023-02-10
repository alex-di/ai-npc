export class BaseError extends Error {
    static type = 'internal_server_error';
    status = 500;
}

export class NotFound extends BaseError {
    static type = 'not_found';
    status = 404;
    constructor() {
        super('Entity not found')
    }
}