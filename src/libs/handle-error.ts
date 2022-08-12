import { Unauthorized } from '@models/libs/error-models/errors';
import { ERROR_MESSAGES } from './constants';

export const handleError = (err: any) => {
    console.log(err);

    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }

    if (err.message === 'jwt expired') {
        return new Unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return err;
};
