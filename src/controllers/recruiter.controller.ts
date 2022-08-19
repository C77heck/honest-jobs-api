import Ad, { AdDocument } from '@models/ad';
import { JobSeekerDocument } from '@models/job-seeker';
import { BadRequest, HttpError, InternalServerError } from '@models/libs/error-models/errors';
import Recruiter, { RecruiterDocument } from '@models/recruiter';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from '../libs/handle-validation';
import { extractRecruiter, getUserId } from './libs/helpers';
import { AdQueryHandler } from './libs/mongo-query-handlers/ad-query.handler';
import { SafeRecruiterData } from './libs/sase-recruiter.data';

export const signup = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const userService = new UserService<JobSeekerDocument>(Recruiter);

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

        const userService = new UserService<RecruiterDocument>(Recruiter);

        const { user, token } = await userService.login(req);

        const userData = new SafeRecruiterData(user);
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

        await Recruiter.updateUser(req.body, userId);

        res.status(201).json({ message: 'User data has been successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getAds = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const recruiter = await extractRecruiter(req);

        const { filters, pagination, sort } = new AdQueryHandler(req);

        const postedJobs = await recruiter.getPostedJobs(pagination, filters, sort,);

        res.status(200).json(postedJobs);
    } catch (err) {
        return next(handleError(err));
    }
};

export const createNewAd = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const user = await extractRecruiter(req);

        const createdAd: any = new Ad({ ...req.body, logo: user.logo } as AdDocument);

        await createdAd.save();

        await user.addPostedJobs(createdAd?._id);

        res.status(201).json({ message: 'New ad has been successfully added' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const updateAd = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const updatedAd = await Ad.updateAd(req.params.adId, req.body as AdDocument);

        res.status(200).json({ updatedAd, message: 'Successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const deleteAd = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const ad = await Ad.findById(req.params.adId);

        const user = await extractRecruiter(req);

        await user.removePostedJob(ad?._id);

        await ad.remove();

        res.status(201).json({ message: 'Ad has been successfully deleted' });
    } catch (err) {
        return next(new HttpError(
            'Could not delete Ad, please try again.',
            500
        ));
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
        const user = await extractRecruiter(req);

        await user.remove();

        res.status(200).json({ message: 'Account has been successfully deleted.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const whoami = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const user = await extractRecruiter(req);

        res.status(200).json({ userData: new SafeRecruiterData(user) });
    } catch (err) {
        return next(handleError(err));
    }
};
