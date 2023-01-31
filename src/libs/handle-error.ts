import { Unauthorized } from '../../dist/models/libs/error-models/errors';
import { ERROR_MESSAGES } from './constants';

export const handleError = (err: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }
    // todo might not need
    if (err.message === 'jwt expired') {
        return new Unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return err;
};
