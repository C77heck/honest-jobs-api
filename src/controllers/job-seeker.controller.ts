import Ad from '@models/ad';
import JobSeeker, { JobSeekerDocument } from '@models/job-seeker';
import { BadRequest, InternalServerError } from '@models/libs/error-models/errors';
import Recruiter from '@models/recruiter';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from "../libs/handle-validation";
import { extractJobSeeker, getUserId } from './libs/helpers';
import { SafeJobSeekerData } from './libs/safe-job-seeker.data';

export const signup = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const userService = new UserService<JobSeekerDocument>(JobSeeker);

        handleValidation(req as any as any);

        const result = await userService.signup(req);

        res.json({ result });
    } catch (err) {
        return next(handleError(err));
    }
};

export const login = async (req: express.Request, res: express.Response, next: NextFunction) => {
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
};

export const updateUserData = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        handleValidation(req as any);

        const userId = await getUserId(req);

        await JobSeeker.updateUser(req.body, userId);

        res.status(201).json({ message: 'User data has been successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getUserData = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        handleValidation(req as any);

        const userData = await JobSeeker.getUser(req.params.userId);

        res.status(201).json({ meta: new SafeJobSeekerData(userData) });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getSecurityQuestion = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        if (!req.body.email) {
            throw new BadRequest(ERROR_MESSAGES.MISSING_EMAIL);
        }

        const user = await Recruiter.findOne({ email: req.body.email });

        if (!user) {
            throw new BadRequest(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        const securityQuestion = await user.getUserSecurityQuestion();

        if (!securityQuestion) {
            throw new InternalServerError(ERROR_MESSAGES.GENERIC);
        }

        res.status(200).json({ securityQuestion });
    } catch (err) {
        return next(handleError(err));
    }
};

export const deleteAccount = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const user = await extractJobSeeker(req);

        await user.remove();

        res.status(200).json({ message: 'Account has been successfully deleted.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const whoami = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const user = await extractJobSeeker(req);

        res.status(200).json({ userData: new SafeJobSeekerData(user) });
    } catch (err) {
        return next(handleError(err));
    }
};

export const addJobView = async (req: express.Request, res: express.Response, next: NextFunction) => {
    let user;
    try {
        user = await extractJobSeeker(req);
    } catch (e) {
        console.log({ e });
    }

    try {
        const { sessionId, adId } = req.body;

        if (!adId) {
            throw new BadRequest(ERROR_MESSAGES.AD_ID);
        }

        if (!user) {
            if (!sessionId) {
                throw new BadRequest(ERROR_MESSAGES.MISSING_SESSION_ID);
            }
            await Ad.addGuestView(sessionId, adId);
        } else {
            await Ad.addRegisteredUserView(user?._id, adId);
            await user.addView(req.body.adId);
        }

        res.json({ message: 'Success' });
    } catch (err) {
        next(handleError(err));
    }
};

export const addAppliedFor = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const user = await extractJobSeeker(req);

        await user.addAppliedJobs(req.params.adId);

        return Ad.addAppliedFor(req.params.adId);
    } catch (err) {
        next(handleError(err));
    }
};
