import Ad from '@models/ad';
import Application from '@models/application';
import JobSeeker from '@models/job-seeker';
import { BadRequest } from '@models/libs/error-models/errors';
import { ApplyService } from '@services/apply.service';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { check } from 'express-validator';
import { ERROR_MESSAGES, MESSAGE } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { ExpressController } from './libs/express.controller';
import { field } from './libs/helpers/validator/field';
import { trim } from './libs/helpers/validator/formatters';
import { email, required } from './libs/helpers/validator/validators';

export class JobSeekerController extends ExpressController {
    public applyService: ApplyService;

    public injectServices() {
        super.injectServices();
        this.userServices = new UserService(JobSeeker);
        this.applyService = new ApplyService(Application);
    }

    public initializeRouters() {
        this.router.post('/login', [
            field.bind(this, 'email', [required, email, trim]),
            field.bind(this, 'password', [required])
        ], this.login.bind(this));

        this.router.post('/signup', [
            field.bind(this, 'first_name', [required]),
            field.bind(this, 'last_name', [required]),
            field.bind(this, 'email', [required, trim, email]),
            field.bind(this, 'password', [required]),
            field.bind(this, 'securityQuestion', [required]),
            field.bind(this, 'securityAnswer', [required]),
        ], this.signup.bind(this));

        // this.router.use(simpleUserAuth.bind(this));
        this.router.put('/update', [
            field.bind(this, 'first_name', [required]),
            field.bind(this, 'last_name', [required]),
            field.bind(this, 'description', [required]),
            field.bind(this, 'meta', [required]),
            field.bind(this, 'images', [required]),
            field.bind(this, 'resume', [required]),
            field.bind(this, 'other_uploads', [required]),
        ], this.updateUserData.bind(this));

        this.router.get('/whoami', [], this.whoami.bind(this));

        this.router.get('/get-security-question', [], this.getSecurityQuestion.bind(this));

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], this.deleteAccount.bind(this));

        this.router.post('/add-view', [], this.addJobView.bind(this));

        this.router.put('/add-to-favourites/:adId', [], this.addToFavourites.bind(this));

        this.router.put('/remove-from-favourites/:adId', [], this.removeFromFavourites.bind(this));

        this.router.get('/has-applied/:adId', [], this.hasApplied.bind(this));

        this.router.post('/apply', [], this.apply.bind(this));
    }

    public async hasApplied(req: any, res: any, next: NextFunction) {
        try {
            const user = await this.userServices.extractUser(req);

            const ad = await this.adService.getAd(req.params?.adId);

            const createdApplicants = await this.applyService.getByApplicant(ad, user);

            res.status(200).json({ hasApplied: !!createdApplicants });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async apply(req: any, res: any, next: NextFunction) {
        try {
            const user = await this.userServices.extractUser(req);

            const ad = await this.adService.getAd(req.body?.adId);

            const createdApplicants = await this.applyService.create(ad, user);

            res.status(200).json({ createdApplicants, message: MESSAGE.SUCCESS.APPLIED });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async addToFavourites(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            this.handleValidation(req);

            const adId = req.params?.adId;

            if (!adId) {
                throw new BadRequest('Missing ad id');
            }

            const user = await this.userServices.extractUser(req);

            await user.addToFavourites(adId);

            res.json({ message: MESSAGE.SUCCESS.ADDED_TO_FAVOURITES });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async removeFromFavourites(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            this.handleValidation(req);

            const adId = req.params?.adId;

            if (!adId) {
                throw new BadRequest('Missing ad id');
            }

            const user = await this.userServices.extractUser(req);

            await user.removeFromFavourites(adId);

            res.json({ message: MESSAGE.SUCCESS.REMOVED_FROM_FAVOURITES });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async signup(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            this.handleValidation(req);

            const result = await this.userServices.signup(req);

            res.json({ result });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async login(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            this.handleValidation(req);

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
            this.handleValidation(req);

            await this.userServices.updateUser(req, req.body);

            res.status(201).json({ message: MESSAGE.SUCCESS.USER_DATA_UPDATED });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getSecurityQuestion(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            if (!req.body.email) {
                throw new BadRequest(ERROR_MESSAGES.MISSING.EMAIL);
            }

            const securityQuestion = await this.userServices.getSecurityQuestion(req);

            res.status(200).json({ securityQuestion });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async deleteAccount(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const jobSeeker = await this.userServices.extractUser(req);

            await jobSeeker.remove();

            res.status(200).json({ message: MESSAGE.SUCCESS.ACCOUNT_DELETED });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async whoami(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const jobSeeker = await this.userServices.extractUser(req);

            res.status(200).json({ userData: jobSeeker.getPublicData() });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async addJobView(req: express.Request, res: express.Response, next: NextFunction) {
        let jobSeeker;
        try {
            jobSeeker = await this.userServices.extractUser(req);

        } catch (e) {
            console.log({ e });
        }

        try {
            const { sessionId, adId } = req.body;

            if (!adId) {
                throw new BadRequest(ERROR_MESSAGES.MISSING.AD);
            }

            if (!jobSeeker) {
                if (!sessionId) {
                    throw new BadRequest(ERROR_MESSAGES.MISSING.SESSION_ID);
                }
                await Ad.addGuestView(sessionId, adId);
            } else {
                await Ad.addRegisteredUserView(jobSeeker?._id, adId);
                await jobSeeker.addView(req.body.adId);
            }

            res.json({ message: MESSAGE.SUCCESS.GENERIC });
        } catch (err) {
            next(handleError(err));
        }
    }

    public async addAppliedFor(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const jobSeeker = await this.userServices.extractUser(req);

            await jobSeeker.addAppliedJobs(req.params.adId);

            return Ad.addAppliedFor(req.params.adId);
        } catch (err) {
            next(handleError(err));
        }
    }
}

export default new JobSeekerController();
