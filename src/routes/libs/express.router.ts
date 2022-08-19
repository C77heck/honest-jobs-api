import express from 'express';
import { AdController } from '../../controllers/ad-controller';
import { AnalyticsController } from '../../controllers/analytics.controller';
import { JobSeekerController } from '../../controllers/job-seeker.controller';
import { RecruiterController } from '../../controllers/recruiter.controller';
import { ReviewController } from '../../controllers/review-controller';

export class ExpressRouter {
    public router: express.Router;
    public recruiterController!: RecruiterController;
    public adController!: AdController;
    public jobSeekerController!: JobSeekerController;
    public reviewController!: ReviewController;
    public analyticsController!: AnalyticsController;

    public constructor() {
        this.router = express.Router();
        this.recruiterController = new RecruiterController();
        this.adController = new AdController();
        this.jobSeekerController = new JobSeekerController();
        this.reviewController = new ReviewController();
        this.analyticsController = new AnalyticsController();
        this.initializeRouter();
    }

    public initializeRouter() {
    }
}
