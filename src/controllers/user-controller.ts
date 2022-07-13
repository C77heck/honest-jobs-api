import {
    BadRequest,
    Forbidden,
    HttpError,
    InternalServerError
} from '@models/libs/error-models/errors';
import User, { UserDocument } from '@models/user';

import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { startSession } from 'mongoose';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from "../libs/error-handler";
import { extractUser } from './libs/helpers';
import { SafeUserData } from './libs/safe.user.data';

export const getJobSeekers = async (req: any, res: any, next: NextFunction) => {
    try {
        const recruiters = await User.getJobSeekers();

        res.status(200).json({ recruiters });
    } catch (e) {
        return next(e);
    }
};

export const getRecruiters = async (req: any, res: any, next: NextFunction) => {
    try {
        const recruiters = await User.getRecruiters();

        res.status(200).json({ recruiters });
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }
};

export const login = async (req: any, res: any, next: NextFunction) => {
    try {
        handleError(req, next);

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

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

        await res.json({
            userData: {
                meta: new SafeUserData(user),
                userId: user.id,
                token: token,
            }
        });
    } catch (e) {
        return next(e);
    }
};

export const signup = async (req: any, res: any, next: NextFunction) => {
    const session = await startSession();
    session.startTransaction();

    try {
        handleError(req);
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email });

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
            createdUser = new User({
                ...req.body as UserDocument,
                password: hashedPassword
            });

            await createdUser.save();
        } catch (err) {
            throw new InternalServerError('Could not create user, please try again.', { session });
        }

        await session.commitTransaction();
        await session.endSession();

        await login(req, res, next);
    } catch (e) {
        await e.payload.session.abortTransaction();
        await e.payload.session.endSession();
        return next(e);
    }
};

export const getSecurityQuestion = async (req: any, res: any, next: NextFunction) => {
    try {
        const user = await extractUser(req);
        const securityQuestion = await user.getUserSecurityQuestion();

        if (!securityQuestion) {
            throw new InternalServerError(ERROR_MESSAGES.GENERIC);
        }

        res.status(200).json({ securityQuestion });
    } catch (e) {
        return next(e);
    }
};

export const updateUserData = async (req: any, res: any, next: NextFunction) => {
    try {
        handleError(req, next);

        await User.updateUser(req.body, req.params.userId);

        res.status(201).json({ message: 'User data has been successfully updated.' });
    } catch (e) {
        return next(e);
    }
};

export const getUserData = async (req: any, res: any, next: NextFunction) => {
    try {
        handleError(req, next);

        const userData = await User.getUser(req.params.userId);

        res.status(201).json({ meta: new SafeUserData(userData) });
    } catch (e) {
        return next(e);
    }
};

export const deleteAccount = async (req: any, res: any, next: NextFunction) => {
    try {
        await User.deleteUser(req.params.userId);
    } catch (e) {
        return next(e);
    }

    res.status(200).json({ message: 'Account has been successfully deleted.' });
};

export const whoami = async (req: any, res: any, next: NextFunction) => {
    try {
        const userData = await User.findById(req.params.userId);

        res.status(200).json({ meta: new SafeUserData(userData) });
    } catch (e) {
        return next(e);
    }
};
