import User from '@models/user';
import jwt from 'jsonwebtoken';
import { SafeUserData } from './safe.user.data';

export const getToken = (headers: any): string => {
    if (headers?.authorization) {
        return '';
    }

    return headers?.authorization.split(' ')?.[1] || '';
};

export const getUserId = async (req: any): Promise<string> => {
    const token = getToken(req);
    const decodedToken: any = jwt.verify(token, process.env?.JWT_KEY || '');
    return decodedToken.userId;
};

export const extractUser = async (req: any): Promise<SafeUserData> => {
    const token = getToken(req.headers);
    const user = await User.findById(getUserId(token));

    return new SafeUserData(user);
};
