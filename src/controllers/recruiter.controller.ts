import Ad, { AdDocument } from '@models/ad';
import {
    BadRequest,
    Forbidden,
    HttpError,
    InternalServerError
} from '@models/libs/error-models/errors';
import Recruiter from '@models/recruiter';
import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { startSession } from 'mongoose';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from '../libs/handle-validation';
import { extractRecruiter, getUserId } from './libs/helpers';
import { extractQuery, getMongoSortOptions, getPaginationFromRequest } from './libs/query';
import { SafeRecruiterData } from './libs/sase-recruiter.data';

export const signup = async (req: any, res: any, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();

    try {
        handleValidation(req);
        const { email, password } = req.body;

        const existingUser = await Recruiter.findOne({ email: email });

        if (existingUser) {
            throw new BadRequest('The email you entered, is already in use', { session });
        }

        let hashedPassword: string;

        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (err) {
            throw new InternalServerError('Could not create user, please try again.', { session });
        }

        let createdUser: any;
        try {
            createdUser = new Recruiter({
                ...req.body,
                password: hashedPassword
            });

            await createdUser.save();
        } catch (err) {
            throw new InternalServerError('Could not create user, please try again.', { session });
        }

        await session.commitTransaction();
        await session.endSession();

        await login(req, res, next);
    } catch (err) {
        await err.payload.session.abortTransaction();
        await err.payload.session.endSession();
        return next(handleError(err));
    }
};

export const updateUserData = async (req: any, res: any, next: NextFunction) => {
    try {
        handleValidation(req, next);

        const userId = await getUserId(req);

        await Recruiter.updateUser(req.body, userId);

        res.status(201).json({ message: 'User data has been successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getAds = async (req: any, res: any, next: NextFunction) => {
    try {
        const recruiter = await extractRecruiter(req);

        const filters = extractQuery(req);
        const sort = getMongoSortOptions(req);
        const pagination = getPaginationFromRequest(req);
        console.log(req.query);
        const postedJobs = await recruiter.getPostedJobs(pagination, filters, sort,);

        res.status(200).json(postedJobs);
    } catch (err) {
        return next(handleError(err));
    }
};

export const createNewAd = async (req: any, res: any, next: NextFunction) => {
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

export const updateAd = async (req: any, res: any, next: NextFunction) => {
    try {
        const updatedAd = await Ad.updateAd(req.params.adId, req.body as AdDocument);

        res.status(200).json({ updatedAd, message: 'Successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const deleteAd = async (req: any, res: any, next: NextFunction) => {
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

export const login = async (req: any, res: any, next: NextFunction) => {
    try {
        handleValidation(req, next);

        const { email, password } = req.body;

        const user = await Recruiter.findOne({ email: email });

        if (!user) {
            throw new Forbidden('Invalid credentials, please try again.');
        }

        let isValidPassword = false;
        try {
            isValidPassword = await bcrypt.compare(password, user.password);
        } catch (err) {
            user.loginAttempts(user.status.loginAttempts + 1);

            throw new Forbidden('Could not log you in, please check your credentials and try again');
        }

        if (!isValidPassword) {
            user.loginAttempts(user.status.loginAttempts + 1);

            throw new Forbidden('Could not log you in, please check your credentials and try again');
        }

        await user.loginAttempts(0);

        let token;
        try {
            token = jwt.sign({ userId: user._id, email: user.email },
                process.env?.JWT_KEY || '',
                { expiresIn: '24h' }
            );
        } catch (err) {
            throw new InternalServerError('Login failed, please try again');
        }

        const userData = new SafeRecruiterData(user);

        res.json({
            userData: {
                ...userData,
                userId: user.id,
                token: token,
                type: 'recruiter',
            }
        });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getSecurityQuestion = async (req: any, res: any, next: NextFunction) => {
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

export const deleteAccount = async (req: any, res: any, next: NextFunction) => {
    try {
        const user = await extractRecruiter(req);

        await user.remove();

        res.status(200).json({ message: 'Account has been successfully deleted.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const whoami = async (req: any, res: any, next: NextFunction) => {
    try {
        const user = await extractRecruiter(req);

        res.status(200).json({ userData: new SafeRecruiterData(user) });
    } catch (err) {
        return next(handleError(err));
    }
};
