import JobSeeker from '@models/job-seeker';
import { BadRequest, Forbidden, InternalServerError } from '@models/libs/error-models/errors';
import Recruiter from '@models/recruiter';

import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { startSession } from 'mongoose';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { handleValidation } from "../libs/handle-validation";
import { extractJobSeeker, getUserId } from './libs/helpers';
import { SafeJobSeekerData } from './libs/safe-job-seeker.data';

export const signup = async (req: any, res: any, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();

    try {
        handleValidation(req);
        const { email, password } = req.body;

        const existingUser = await JobSeeker.findOne({ email: email });

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
            createdUser = new JobSeeker({
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

        await JobSeeker.updateUser(req.body, userId);

        res.status(201).json({ message: 'User data has been successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getUserData = async (req: any, res: any, next: NextFunction) => {
    try {
        handleValidation(req, next);

        const userData = await JobSeeker.getUser(req.params.userId);
        // TODO -> perhaps a fix is needed with the dto
        res.status(201).json({ meta: new SafeJobSeekerData(userData) });
    } catch (err) {
        return next(handleError(err));
    }
};

export const login = async (req: any, res: any, next: NextFunction) => {
    try {
        handleValidation(req, next);

        const { email, password } = req.body;

        const user = await JobSeeker.findOne({ email: email });

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
        const userData = new SafeJobSeekerData(user);
        await res.json({
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
        const user = await extractJobSeeker(req);

        await user.remove();

        res.status(200).json({ message: 'Account has been successfully deleted.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const whoami = async (req: any, res: any, next: NextFunction) => {
    try {
        const user = await extractJobSeeker(req);

        res.status(200).json({ userData: new SafeJobSeekerData(user) });
    } catch (err) {
        return next(handleError(err));
    }
};