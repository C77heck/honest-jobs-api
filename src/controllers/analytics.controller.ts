import { randomUUID } from 'crypto';
import express, { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';
import { ExpressController } from './libs/express.controller';

export class AnalyticsController extends ExpressController {
    public initializeRouters() {
        this.router.get('/', [], this.getSessionId.bind(this));
    }

    public async getSessionId(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const sessionId = randomUUID();

            res.json({ sessionId });
        } catch (e) {
            next(handleError(e));
        }
    }
}

export default new AnalyticsController();
