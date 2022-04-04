import { loginAttempts } from '@models/libs/helpers';
import { NextFunction } from 'express';

import bcrypt from 'bcryptjs';
import { HttpError } from '../models/http-error';
import Admin, { AdminModel } from '../models/admin';
import { handleError } from "../libs/error-handler";
import jwt from 'jsonwebtoken';

export const login = async (req: any, res: any, next: NextFunction) => {
    handleError(req, next);
    const { email, password } = req.body;

    let existingUser: AdminModel | null;

    try {
        existingUser = await Admin.findOne({ email: email });
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
        loginAttempts(Admin, existingUser._id, existingUser.status.loginAttempts + 1);

        return next(new HttpError(
            'Could not log you in, please check your credentials and try again',
            401
        ));
    }

    try {
        if (!isValidPassword) {
            loginAttempts(Admin, existingUser._id, existingUser.status.loginAttempts + 1);

            return next(new HttpError(
                'Could not log you in, please check your credentials and try again',
                401
            ));
        } else {
            loginAttempts(Admin, existingUser._id, 0);
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
    const { name, email, password, hint, answer, isEmployer } = req.body;

    let existingUser;
    try {
        existingUser = await Admin.findOne({ email: email });
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

    const createdAdmin: any = new Admin({
        name,
        email,
        hint,
        answer,
        isEmployer,
        password: hashedPassword
    });
    try {
        await createdAdmin.save();
    } catch (err) {
        return next(new HttpError(
            'Could not create user, please try again.',
            500
        ));
    }

    let token;
    try {
        token = jwt.sign({ userId: createdAdmin.id, email: createdAdmin.email },
            process.env?.JWT_KEY || '',
            { expiresIn: '24h' }
        );
    } catch (err) {
        return next(new HttpError(
            'Login failed, please try again',
            500
        ));
    }

    res.status(201).json({ userData: { userId: createdAdmin.id, token: token } });
};

