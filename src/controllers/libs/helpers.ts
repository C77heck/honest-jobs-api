import JobSeeker, { JobSeekerDocument } from '@models/job-seeker';
import { BadRequest, Unauthorized } from '@models/libs/error-models/errors';
import Recruiter, { RecruiterDocument } from '@models/recruiter';

import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../../libs/constants';

export const getToken = (req: any): string => {
    if (!req?.headers?.authorization) {
        return '';
    }

    return (req?.headers?.authorization || '').split(' ')?.[1] || '';
};

export const getUserId = async (req: any): Promise<string> => {
    try {
        const token = getToken(req);
        const decodedToken: any = jwt.verify(token, process.env?.JWT_KEY || '');
        return decodedToken.userId;
    } catch (e) {
        throw new Unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
    }
};

export const extractJobSeeker = async (req: any): Promise<JobSeekerDocument> => {
    const userId = await getUserId(req);

    const user = await JobSeeker.findById(userId);

    if (!user) {
        throw new BadRequest(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
};

export const extractRecruiter = async (req: any): Promise<RecruiterDocument> => {
    const userId = await getUserId(req);

    const user = await Recruiter.findById(userId);

    if (!user) {
        throw new BadRequest(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
};
