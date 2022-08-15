import { randomUUID } from 'crypto';
import express from 'express';
import { handleError } from '../libs/handle-error';

export const getSessionId = (req: express.Request, res: express.Response) => {
    try {
        const sessionId = randomUUID();

        res.json({ sessionId });
    } catch (e) {
        handleError(e);
    }
};
