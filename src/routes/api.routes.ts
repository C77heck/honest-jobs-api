import express from 'express';
import adController from '../controllers/ad-controller';
import analyticsController from '../controllers/analytics.controller';
import jobSeekerController from '../controllers/job-seeker.controller';
import recruiterController from '../controllers/recruiter.controller';

class ExpressApiRouter {
    public router: express.Router;

    public constructor() {
        this.router = express.Router();
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.use('/users/recruiter', recruiterController.router);
        this.router.use('/users/job-seeker', jobSeekerController.router);
        this.router.use('/ads', adController.router);
        this.router.use('/analytics', analyticsController.router);
    }
}

export default new ExpressApiRouter();
