import { ExpressRouter } from '@routes/libs/express.router';

import { getSessionId } from '../controllers/analytics.controller';

class AnalyticsRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/', [], getSessionId);
    }
}

export default new AnalyticsRouter();
