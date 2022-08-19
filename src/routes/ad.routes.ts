import { ExpressRouter } from '@routes/libs/express.router';

class AdRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/', [], this.adController.getAllAds);

        this.router.get('/get-ads-by-employer/:recruiterId', [], this.adController.getAdsByEmployer);

        this.router.get('/get-by-id/:adId', [], this.adController.getById);

        this.router.get('/ad-filters', [], this.adController.getFilters);

        this.router.get('/test-filter-creation', [], this.adController.createFilters);

        this.router.post('/add-view', [], this.jobSeekerController.addJobView);
    }
}

export default new AdRouter();
