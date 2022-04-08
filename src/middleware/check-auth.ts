import User from '@models/user';
import { NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { HttpError } from '@models/libs/http-error';

interface AuthHeaders extends Headers {
    authorization?: string;
}

interface CustomRequest extends Request {
    headers: AuthHeaders;
    userData: any;
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction): any => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req?.headers?.authorization?.split(' ')[1];

        if (!token) {
            throw new Error('Authentication failed!');
        }

        const decodedToken: any = jwt.verify(token, process.env?.JWT_KEY || '');
        req.userData = {
            userId: decodedToken.userId,
            isRecruiter: await User.getUser(decodedToken.userId)
        };

        next();
    } catch (err) {
        return next(new HttpError(
            'Authentication failed!',
            401
        ));
    }
};
