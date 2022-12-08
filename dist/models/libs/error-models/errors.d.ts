export declare type ErrorType = 'BadRequest' | 'MissingResource' | 'Forbidden' | 'Unauthorized' | 'NotFound' | 'MethodNotAllowed' | 'RequestTimeout' | 'UnprocessableEntity' | 'InternalServerError' | 'BadGateway' | 'GatewayTimeout' | 'NotAcceptable' | 'PayloadTooLarge' | 'HttpError' | 'ServiceUnavailable';
export interface HttpError {
    message: string;
    code: number;
    type: ErrorType;
    payload: any;
}
export declare class HttpError extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, code?: number, payload?: any);
}
export declare class BadRequest extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class Unauthorized extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class Forbidden extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class NotFound extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class MethodNotAllowed extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class NotAcceptable extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class RequestTimeout extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class InternalServerError extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class UnprocessableEntity extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class ServiceUnavailable extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class GatewayTimeout extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class BadGateway extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
export declare class PayloadTooLarge extends Error implements HttpError {
    code: number;
    type: ErrorType;
    payload: any;
    constructor(message: string, payload?: any);
}
