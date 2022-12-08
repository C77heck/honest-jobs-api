"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadTooLarge = exports.BadGateway = exports.GatewayTimeout = exports.ServiceUnavailable = exports.UnprocessableEntity = exports.InternalServerError = exports.RequestTimeout = exports.NotAcceptable = exports.MethodNotAllowed = exports.NotFound = exports.Forbidden = exports.Unauthorized = exports.BadRequest = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message, code, payload) {
        super(message || 'HttpError');
        this.type = 'HttpError';
        this.code = code || 500;
        this.payload = payload;
    }
}
exports.HttpError = HttpError;
class BadRequest extends Error {
    constructor(message, payload) {
        super(message || 'BadRequest');
        this.type = 'BadRequest';
        this.code = 400;
        this.payload = payload;
    }
}
exports.BadRequest = BadRequest;
class Unauthorized extends Error {
    constructor(message, payload) {
        super(message || 'Unauthorized');
        this.type = 'Unauthorized';
        this.code = 401;
        this.payload = payload;
    }
}
exports.Unauthorized = Unauthorized;
class Forbidden extends Error {
    constructor(message, payload) {
        super(message || 'Forbidden');
        this.type = 'Forbidden';
        this.code = 403;
        this.payload = payload;
    }
}
exports.Forbidden = Forbidden;
class NotFound extends Error {
    constructor(message, payload) {
        super(message || 'NotFound');
        this.type = 'NotFound';
        this.code = 404;
        this.payload = payload;
    }
}
exports.NotFound = NotFound;
class MethodNotAllowed extends Error {
    constructor(message, payload) {
        super(message || 'MethodNotAllowed');
        this.type = 'MethodNotAllowed';
        this.code = 405;
        this.payload = payload;
    }
}
exports.MethodNotAllowed = MethodNotAllowed;
class NotAcceptable extends Error {
    constructor(message, payload) {
        super(message || 'NotAcceptable');
        this.type = 'NotAcceptable';
        this.code = 406;
        this.payload = payload;
    }
}
exports.NotAcceptable = NotAcceptable;
class RequestTimeout extends Error {
    constructor(message, payload) {
        super(message || 'RequestTimeout');
        this.type = 'RequestTimeout';
        this.code = 408;
        this.payload = payload;
    }
}
exports.RequestTimeout = RequestTimeout;
class InternalServerError extends Error {
    constructor(message, payload) {
        super(message || 'InternalServerError');
        this.type = 'InternalServerError';
        this.code = 500;
        this.payload = payload;
    }
}
exports.InternalServerError = InternalServerError;
class UnprocessableEntity extends Error {
    constructor(message, payload) {
        super(message);
        this.type = 'UnprocessableEntity';
        this.code = 422;
        this.payload = payload;
    }
}
exports.UnprocessableEntity = UnprocessableEntity;
class ServiceUnavailable extends Error {
    constructor(message, payload) {
        super(message || 'ServiceUnavailable');
        this.type = 'ServiceUnavailable';
        this.code = 503;
        this.payload = payload;
    }
}
exports.ServiceUnavailable = ServiceUnavailable;
class GatewayTimeout extends Error {
    constructor(message, payload) {
        super(message || 'GatewayTimeout');
        this.type = 'GatewayTimeout';
        this.code = 504;
        this.payload = payload;
    }
}
exports.GatewayTimeout = GatewayTimeout;
class BadGateway extends Error {
    constructor(message, payload) {
        super(message || 'BadGateway');
        this.type = 'BadGateway';
        this.code = 502;
        this.payload = payload;
    }
}
exports.BadGateway = BadGateway;
class PayloadTooLarge extends Error {
    constructor(message, payload) {
        super(message || 'PayloadTooLarge');
        this.type = 'PayloadTooLarge';
        this.code = 413;
        this.payload = payload;
    }
}
exports.PayloadTooLarge = PayloadTooLarge;
