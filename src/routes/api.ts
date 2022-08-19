import adRoutes from '@routes/ad.routes';
import analyticsRoutes from '@routes/analytics.routes';
import jobSeekerRoutes from '@routes/job-seeker.routes';
import { ExpressRouter } from '@routes/libs/express.router';
import recruiterRoutes from '@routes/recruiter.routes';

// Setup routers
class ExpressApiRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.use('/users/recruiter', recruiterRoutes.router);
        this.router.use('/users/job-seeker', jobSeekerRoutes.router);
        this.router.use('/ads', adRoutes.router);
        this.router.use('/analytics', analyticsRoutes.router);
    }
}

// Export default.
export default new ExpressApiRouter();
