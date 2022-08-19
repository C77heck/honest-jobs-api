import Ad, { AdDocument } from '@models/ad';
import { BadRequest, HttpError } from '@models/libs/error-models/errors';
import Recruiter, { RecruiterDocument } from '@models/recruiter';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from '../libs/handle-validation';
import { ExpressController } from './libs/express.controller';

export class RecruiterController extends ExpressController<RecruiterDocument> {

    public injectServices() {
        super.injectServices();
        this.userServices = new UserService(Recruiter);
    }

    public async signup(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            handleValidation(req as any as any);

            const result = await this.userServices.signup(req);

            res.json({ result });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async login(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            handleValidation(req as any);
            const { user, token } = await this.userServices.login(req);

            const userData = user.getPublicData();

            res.json({
                userData: {
                    ...userData,
                    userId: user.id,
                    token: token,
                }
            });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async updateUserData(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            handleValidation(req as any);
            await this.userServices.updateUser(req, req.body);

            res.status(201).json({ message: 'User data has been successfully updated.' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getAds(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const recruiter = await this.userServices.extractUser(req);

            const { filters, pagination, sort } = this.adQueryService.getFormattedData(req);

            const postedJobs = await recruiter.getPostedJobs(pagination, filters, sort,);

            res.status(200).json(postedJobs);
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async createNewAd(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const recruiter = await this.userServices.extractUser(req);

            const createdAd: any = new Ad({ ...req.body, logo: recruiter.logo } as AdDocument);

            await createdAd.save();

            await recruiter.addPostedJobs(createdAd?._id);

            res.status(201).json({ message: 'New ad has been successfully added' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async updateAd(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const updatedAd = await Ad.updateAd(req.params.adId, req.body as AdDocument);

            res.status(200).json({ updatedAd, message: 'Successfully updated.' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async deleteAd(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const ad = await Ad.findById(req.params.adId);
            const recruiter = await this.userServices.extractUser(req);

            await recruiter.removePostedJob(ad?._id);

            await ad.remove();

            res.status(201).json({ message: 'Ad has been successfully deleted' });
        } catch (err) {
            return next(new HttpError(
                'Could not delete Ad, please try again.',
                500
            ));
        }
    }

    public async getSecurityQuestion(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            if (!req.body.email) {
                throw new BadRequest(ERROR_MESSAGES.MISSING_EMAIL);
            }
            const securityQuestion = await this.userServices.getSecurityQuestion(req);

            res.status(200).json({ securityQuestion });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async deleteAccount(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const recruiter = await this.userServices.extractUser(req);

            await recruiter.remove();

            res.status(200).json({ message: 'Account has been successfully deleted.' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async whoami(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const recruiter = await this.userServices.extractUser(req);

            res.status(200).json({ userData: recruiter.getPublicData() });
        } catch (err) {
            return next(handleError(err));
        }
    }

}
