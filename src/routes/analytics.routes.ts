import { ExpressRouter } from '@routes/libs/express.router';
import { NextFunction, Request, Response } from 'express';

class AnalyticsRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/', [], (req: Request, res: Response, next: NextFunction) => this.analyticsController.getSessionId(req, res, next));
    }
}

export default new AnalyticsRouter();
