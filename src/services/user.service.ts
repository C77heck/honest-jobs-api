import JobSeeker from '@models/job-seeker';
import { BadRequest, Forbidden, InternalServerError } from '@models/libs/error-models/errors';
import { BaseUserDocument } from '@models/user';
import { DocumentService } from '@services/libs/document.service';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import { startSession } from 'mongoose';
import { handleValidation } from '../libs/handle-validation';

export class UserService<T extends BaseUserDocument> extends DocumentService<T> {
    public async signup(req: express.Request) {
        const session = await startSession();
        session.startTransaction();

        try {
            handleValidation(req as any as any);
            const { email, password } = req.body;

            const existingUser = await this.collection.findOne({ email: email });

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

                return createdUser.save();
            } catch (err) {
                throw new InternalServerError('Could not create user, please try again.', { session });
            }

            await session.commitTransaction();
            await session.endSession();

            return this.login(req);
        } catch (err) {
            await err.payload.session.abortTransaction();
            await err.payload.session.endSession();

            throw err;
        }
    }

    public async login(req: express.Request) {

        const { email, password } = req.body;

        const user = await this.collection.findOne({ email: email });

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

        return { user, token };
    }
}