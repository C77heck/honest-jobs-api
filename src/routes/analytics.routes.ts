import { ExpressRouter } from '@routes/libs/express.router';

class AnalyticsRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/', [], this.analyticsController.getSessionId);
    }
}

export default new AnalyticsRouter();
