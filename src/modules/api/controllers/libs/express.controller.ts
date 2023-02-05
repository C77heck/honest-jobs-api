import express from 'express';
import { UnprocessableEntity } from '../../../crawler/models/libs/error-models/errors';
import { Provider } from '../../../crawler/providers/provider';
import { validate } from './helpers/validator/validate';

export abstract class ExpressController extends Provider {
    public router: express.Router;

    public boot() {
        this.router = express.Router();
        this.routes();
    }

    public abstract routes(): void;

    public handleValidation(req: express.Request) {
        const errors = validate(req);

        if (!errors.isValid) {
            throw new UnprocessableEntity(`Invalid inputs passed, please check your data`, errors);
        }
    }
}
