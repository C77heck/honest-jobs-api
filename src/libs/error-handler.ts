import { validationResult } from "express-validator";
import { HttpError } from "../models/http-error";

export const handleError = (req: Request, next: (error?: HttpError) => void): any => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError(
            `Invalid inputs passed, please check your data`,
            422
        ));
    }
};
