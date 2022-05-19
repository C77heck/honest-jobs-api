import { HttpError } from '@models/libs/http-error';
import User, { UserDocument } from '@models/user';

import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from "../libs/error-handler";
import { SafeUserData } from './libs/safe.user.data';

export const getJobSeekers = async (req: any, res: any, next: NextFunction) => {
    try {
        const recruiters = await User.getJobSeekers();

        res.status(200).json({ recruiters });
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
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
    handleError(req, next);
    const { email, password } = req.body;

    let existingUser: UserDocument | null;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError(
            `Login failed, please try again later.`,
            500
        ));
    }

    if (!existingUser) {
        return next(new HttpError(
            'Invalid credentials, please try again.',
            401
        ));
    }
    let isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        User.loginAttempts(existingUser._id, existingUser.status.loginAttempts + 1);

        return next(new HttpError(
            'Could not log you in, please check your credentials and try again',
            401
        ));
    }

    try {
        if (!isValidPassword) {
            User.loginAttempts(existingUser._id, existingUser.status.loginAttempts + 1);

            return next(new HttpError(
                'Could not log you in, please check your credentials and try again',
                401
            ));
        } else {
            await User.loginAttempts(existingUser._id, 0);
        }
    } catch (e) {
        console.log('FAILED', e);
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser._id, email: existingUser.email },
            process.env?.JWT_KEY || '',
            { expiresIn: '24h' }
        );
    } catch (err) {
        return next(new HttpError(
            'Login failed, please try again',
            500
        ));
    }

    await res.json({
        userData: {
            meta: new SafeUserData(existingUser),
            userId: existingUser.id,
            token: token,
        }
    });
};

export const signup = async (req: any, res: any, next: NextFunction) => {
    console.log('got in there');
    handleError(req, next);
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        existingUser = null;
    }

    if (existingUser) {
        return next(new HttpError(
            'The email you entered, is already in use',
            400
        ));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {

        return next(new HttpError(
            'Could not create user, please try again.',
            500
        ));
    }
    let createdUser: any;
    try {
        createdUser = new User({
            ...req.body as UserDocument,
            password: hashedPassword
        });
        await createdUser.save();
    } catch (err) {
        return next(new HttpError(
            'Could not create user, please try again.',
            500
        ));
    }

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email },
            process.env?.JWT_KEY || '',
            { expiresIn: '24h' }
        );
    } catch (err) {
        return next(new HttpError(
            'Login failed, please try again',
            500
        ));
    }

    res.status(201).json({
        userData: {
            meta: new SafeUserData(createdUser),
            userId: createdUser.id,
            token: token
        }
    });
};

export const getSecurityQuestion = async (req: any, res: any, next: NextFunction) => {
    let securityQuestion;

    try {
        securityQuestion = await User.getUserSecurityQuestion(req.params.userId);
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ securityQuestion });
};

export const updateUserData = async (req: any, res: any, next: NextFunction) => {
    handleError(req, next);

    try {
        await User.updateUser(req.body, req.params.userId);
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(201).json({ message: 'User data has been successfully updated.' });
};

export const getUserData = async (req: any, res: any, next: NextFunction) => {
    handleError(req, next);
    let userData: UserDocument;

    try {
        userData = await User.getUser(req.params.userId);
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(201).json({ meta: new SafeUserData(userData) });
};

export const deleteAccount = async (req: any, res: any, next: NextFunction) => {
    try {
        await User.deleteUser(req.params.userId);
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ message: 'Account has been successfully deleted.' });
};

export const whoami = async (req: any, res: any, next: NextFunction) => {
    try {
        const userData = await User.findById(req.params.userId);

        res.status(200).json({ meta: new SafeUserData(userData) });
    } catch (e) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }
};
