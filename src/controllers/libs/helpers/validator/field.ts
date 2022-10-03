import express from 'express';
import { FormatterFunction } from './formatters';
import { LengthValidatorFunction, ValidatorFunction } from './validators';

export type ValidatorArgumentOptions =
    ValidatorFunction[]
    | FormatterFunction<any>[]
    | LengthValidatorFunction[];

export const field = (field: string, validators: ValidatorArgumentOptions, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const fieldValue = req.body?.[field];
    const errors = [];

    for (const validator of validators) {
        const result = validator(fieldValue);

        if (!result.isValid) {
            errors.push(result.error);
        }
    }

    if (errors?.length) {
        (req as any).errors = !(req as any).errors ? [{ [field]: errors }] : [...(req as any).errors, { [field]: errors }];
    }

    next();
};
