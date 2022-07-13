import User, { UserDocument } from '@models/user';
import jwt from 'jsonwebtoken';

export const getToken = (req: any): string => {
    if (!req?.headers?.authorization) {
        return '';
    }

    return (req?.headers?.authorization || '').split(' ')?.[1] || '';
};

export const getUserId = async (req: any): Promise<string> => {
    const token = getToken(req);
    const decodedToken: any = jwt.verify(token, process.env?.JWT_KEY || '');
    return decodedToken.userId;
};

export const extractUser = async (req: any): Promise<UserDocument> => {
    const userId = await getUserId(req);

    return User.findById(userId);
};
