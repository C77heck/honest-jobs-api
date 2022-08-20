import Ad from '@models/ad';
import JobSeeker from '@models/job-seeker';
import { BadRequest } from '@models/libs/error-models/errors';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { body, check } from 'express-validator';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from "../libs/handle-validation";
import { ExpressController } from './libs/express.controller';

export class JobSeekerController extends ExpressController {
    public injectServices() {
        super.injectServices();
        this.userServices = new UserService(JobSeeker);
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
                throw new BadRequest(ERROR_MESSAGES.AD_ID);
            }

            if (!jobSeeker) {
                if (!sessionId) {
                    throw new BadRequest(ERROR_MESSAGES.MISSING_SESSION_ID);
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
