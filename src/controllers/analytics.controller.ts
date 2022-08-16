import { randomUUID } from 'crypto';
import express, { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';

export const getSessionId = (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const sessionId = randomUUID();

        res.json({ sessionId });
    } catch (e) {
        next(handleError(e));
    }
};
