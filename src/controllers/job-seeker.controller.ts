import Ad from '@models/ad';
import JobSeeker, { JobSeekerDocument } from '@models/job-seeker';
import { BadRequest } from '@models/libs/error-models/errors';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from "../libs/handle-validation";
import { SafeJobSeekerData } from './libs/safe-job-seeker.data';

export class JobSeekerController {
    public async signup(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            handleValidation(req as any as any);

            const result = await userService.signup(req);

            res.json({ result });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async login(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            handleValidation(req as any);

            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            const { user, token } = await userService.login(req);

            const userData = new SafeJobSeekerData(user);
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

            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            await userService.updateUser(req, req.body);

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

            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            const securityQuestion = await userService.getSecurityQuestion(req);

            res.status(200).json({ securityQuestion });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async deleteAccount(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            const jobSeeker = await userService.extractUser(req);

            await jobSeeker.remove();

            res.status(200).json({ message: 'Account has been successfully deleted.' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async whoami(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            const jobSeeker = await userService.extractUser(req);

            res.status(200).json({ userData: new SafeJobSeekerData(jobSeeker) });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async addJobView(req: express.Request, res: express.Response, next: NextFunction) {
        let jobSeeker;
        try {
            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            jobSeeker = await userService.extractUser(req);

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
            const userService = new UserService<JobSeekerDocument>(JobSeeker);

            const jobSeeker = await userService.extractUser(req);

            await jobSeeker.addAppliedJobs(req.params.adId);

            return Ad.addAppliedFor(req.params.adId);
        } catch (err) {
            next(handleError(err));
        }
    }

}
