// its a middleware -> so next is a must and throw error if it fails otherwise we let it pass.
// we also need to overwrite the value if its sanitizations and such.
// will need to collect it and then create an extractor function in the controller.
import express from 'express';
import { Formatters } from './formatters';

export type FieldError = { [field: string]: string[] }

export class Validator {
    public static addError(req: express.Request, field: string, error: string): void {
        const existingErrors = (req as any)?.errors || {};

        existingErrors[field] = field in existingErrors ? [...existingErrors[field], error] : [error];

        (req as any).errors = existingErrors;
    }

    public static email(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];
        // required, email format, trim

        Validator.required(field, req, res, next);

        Formatters.trim(field, req, res, next);

        next();
    }

    public static password(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];
        // required, email format, trim

        Validator.required(field, req, res, next);
        Formatters.trim(field, req, res, next);
        console.log(fieldValue);
        next();
    }

    public static required(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];

        if (!fieldValue) {
            Validator.addError(req, field, 'Required');
        }

        next();
    }

    public static isString(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];

        if (typeof fieldValue !== 'string') {
            Validator.addError(req, field, 'Must be string');
        }

        next();
    }

    public static isNumber(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];

        if (typeof fieldValue !== 'number') {
            Validator.addError(req, field, 'Must be number');
        }

        next();
    }

    public static isBoolean(field: string, req: express.Request, res: express.Response, next: express.NextFunction) {
        const fieldValue = req.body?.[field];

        if (typeof fieldValue !== 'boolean') {
            Validator.addError(req, field, 'Must be boolean');
        }

        next();
    }
}
