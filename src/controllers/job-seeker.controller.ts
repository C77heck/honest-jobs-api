import Ad from '@models/ad';
import Application from '@models/application';
import JobSeeker from '@models/job-seeker';
import { BadRequest } from '@models/libs/error-models/errors';
import { ApplyService } from '@services/apply.service';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { body, check } from 'express-validator';
import { ERROR_MESSAGES, MESSAGE } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from "../libs/handle-validation";
import { ExpressController } from './libs/express.controller';

export class JobSeekerController extends ExpressController {
    public applyService: ApplyService;

    public injectServices() {
        super.injectServices();
        this.userServices = new UserService(JobSeeker);
        this.applyService = new ApplyService(Application);
    }

    public initializeRouters() {
        this.router.post('/login', [
            check('email').not().isEmpty().escape().trim(),
            check('password').not().isEmpty()
        ], this.login.bind(this));

        this.router.post('/signup', [
            body('*').trim(),
            check('first_name'),
            check('last_name'),
            check('email').normalizeEmail().isEmail(),
            check('password').isLength({ min: 6 }),
            check('securityQuestion').not().isEmpty().escape(),
            check('securityAnswer').isLength({ min: 4 }),
        ], this.signup.bind(this));

        // this.router.use(simpleUserAuth.bind(this));
        this.router.put('/update', [
            body('*').trim(),
            check('first_name').escape(),
            check('last_name').escape(),
            check('description').escape(),
            check('meta').escape(),
            check('images'),
            check('resume'),
            check('other_uploads'),
        ], this.updateUserData.bind(this));

        this.router.get('/whoami', [], this.whoami.bind(this));

        this.router.get('/get-security-question', [], this.getSecurityQuestion.bind(this));

        this.router.delete('/delete-account', [
            check('answer').not().isEmpty(),
        ], this.deleteAccount.bind(this));

        this.router.post('/add-view', [], this.addJobView.bind(this));

        this.router.put('/add-to-favourites/:adId', [], this.addToFavourites.bind(this));

        this.router.put('/remove-from-favourites/:adId', [], this.removeFromFavourites.bind(this));

        this.router.get('/apply/:adId', [], this.hasApplied.bind(this));

        this.router.post('/apply', [], this.apply.bind(this));
    }

    public async hasApplied(req: any, res: any, next: NextFunction) {
        try {
            const user = await this.userServices.extractUser(req);

            const ad = await this.adService.getAd(req.params?.adId);

            const createdApplicants = await this.applyService.getByApplicant(ad, user);

            res.status(200).json({ createdApplicants, message: MESSAGE.SUCCESSFULLY_APPLIED });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async apply(req: any, res: any, next: NextFunction) {
        try {
            const user = await this.userServices.extractUser(req);

            const ad = await this.adService.getAd(req.body?.adId);

            const createdApplicants = await this.applyService.create(ad, user);

            res.status(200).json({ createdApplicants, message: MESSAGE.SUCCESSFULLY_APPLIED });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async addToFavourites(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            handleValidation(req as any as any);

            const adId = req.params?.adId;

            if (!adId) {
                throw new BadRequest('Missing ad id');
            }

            const user = await this.userServices.extractUser(req);

            await user.addToFavourites(adId);

            res.json({ message: 'Successfully added to favourites' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async removeFromFavourites(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            handleValidation(req as any as any);

            const adId = req.params?.adId;

            if (!adId) {
                throw new BadRequest('Missing ad id');
            }

            const user = await this.userServices.extractUser(req);

            await user.removeFromFavourites(adId);

            res.json({ message: 'Successfully removed from favourites' });
        } catch (err) {
            return next(handleError(err));
        }
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

            res.status(200).json({ message: 'Account has been successfully deleted.' });
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

            res.json({ message: 'Success' });
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
