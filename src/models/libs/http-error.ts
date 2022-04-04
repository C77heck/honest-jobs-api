export interface HttpError extends Error {
    message: string;
    code: number;
}

export class HttpError extends Error implements HttpError {
    public code: number;

    constructor(message: string, errorCode: number) {
        super(message);
        this.code = errorCode;
    }
}
