import { getUserSecurityQuestion, loginAttempts } from '@models/libs/helpers';
import { NextFunction } from 'express';

import bcrypt from 'bcryptjs';
import { HttpError } from '@models/libs/http-error';
import User, { UserDocument } from '@models/user';
import { handleError } from "../libs/error-handler";
import jwt from 'jsonwebtoken';

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
            userId: existingUser.id,
            token: token,
        }
    });
};

export const signup = async (req: any, res: any, next: NextFunction) => {
    handleError(req, next);
    const {
        name, email, password, securityQuestion,
        securityAnswer, isEmployer
    } = req.body;

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

    const createdUser: any = new User({
        name,
        email,
        securityQuestion,
        securityAnswer,
        isEmployer,
        password: hashedPassword
    });
    try {
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

    res.status(201).json({ userData: { userId: createdUser.id, token: token } });
};

export const getSecurityQuestion = async (req: any, res: any, next: NextFunction) => {
    let securityQuestion;

    try {
        securityQuestion = await User.getUserSecurityQuestion(req.params.userId);
    } catch (e) {
        return next(new HttpError(
            'Something went wrong, please try again later.',
            500
        ));
    }

    res.status(200).json({ securityQuestion });
};

export const deleteAccount = (req: any, res: any, next: NextFunction) => {

};