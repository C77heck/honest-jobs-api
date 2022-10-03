import Ad from '@models/ad';
import Filter from '@models/filter';
import { JobSeekerDocument } from '@models/job-seeker';
import { UnprocessableEntity } from '@models/libs/error-models/errors';
import { BaseUserDocument } from '@models/user';
import { AdQueryService } from '@services/ad-query.service';
import { AdService } from '@services/ad.service';
import { FilterService } from '@services/filter.service';
import { UserService } from '@services/user.service';
import express from 'express';
import { validate } from './helpers/validator/validate';

export class ExpressController<TUserType extends BaseUserDocument = JobSeekerDocument> {
    public router: express.Router;
    public filterService!: FilterService;
    public adQueryService!: AdQueryService;
    public userServices!: UserService<TUserType>;
    public adService!: AdService;

    public constructor() {
        this.router = express.Router();
        this.initializeRouters();
        this.injectServices();
    }

    public injectServices() {
        this.filterService = new FilterService(Filter);
        this.adQueryService = new AdQueryService();
        this.adService = new AdService(Ad);
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
