import { UnprocessableEntity } from '@models/libs/error-models/errors';
import { validationResult } from "express-validator";

export const handleError = (req: Request, next?: Function): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new UnprocessableEntity(`Invalid inputs passed, please check your data`);
    }
};
