import adController from '../controllers/ad-controller';
import analyticsController from '../controllers/analytics.controller';
import jobSeekerController from '../controllers/job-seeker.controller';
import { ExpressController } from '../controllers/libs/express.controller';
import recruiterController from '../controllers/recruiter.controller';

// Setup routers
class ExpressApiRouter extends ExpressController {
    public initializeRouters() {
        this.router.use('/users/recruiter', recruiterController.router);
        this.router.use('/users/job-seeker', jobSeekerController.router);
        this.router.use('/ads', adController.router);
        this.router.use('/analytics', analyticsController.router);
    }
}

export default new ExpressApiRouter();
