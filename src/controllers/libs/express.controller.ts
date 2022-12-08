import { UnprocessableEntity } from '@models/libs/error-models/errors';
import express from 'express';
import { validate } from './helpers/validator/validate';

export class ExpressController<TUserType> {
    public router: express.Router;
    public someService!: any;

    public constructor() {
        this.router = express.Router();
        this.initializeRouters();
        this.injectServices();
    }

    public injectServices() {
        this.someService = null;

    }

    public initializeRouters() {

    }

    public handleValidation(req: express.Request) {
        const errors = validate(req);

        if (!errors.isValid) {
            throw new UnprocessableEntity(`Invalid inputs passed, please check your data`, errors);
        }
    }
}
