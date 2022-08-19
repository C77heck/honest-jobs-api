import { ExpressRouter } from '@routes/libs/express.router';
import { AdController } from '../controllers/ad-controller';
import { JobSeekerController } from '../controllers/job-seeker.controller';

class AdRouter extends ExpressRouter {
    public adController?: AdController;
    public jobSeekerController?: JobSeekerController;

    public injectControllers() {
        this.adController = new AdController();
        this.jobSeekerController = new JobSeekerController();
    }

    public initializeRouter() {
        super.initializeRouter();
        this.router.get('/get-all-ads', [], this.adController.getAllAds.bind(this));

        this.router.get('/get-ads-by-employer/:recruiterId', [], this.adController.getAdsByEmployer.bind(this));

        this.router.get('/get-by-id/:adId', [], this.adController.getById.bind(this));

        this.router.get('/ad-filters', [], this.adController.getFilters.bind(this));

        this.router.get('/test-filter-creation', [], this.adController.createFilters.bind(this));

        this.router.post('/add-view', [], this.jobSeekerController.addJobView.bind(this));
    }
}

export default new AdRouter();
