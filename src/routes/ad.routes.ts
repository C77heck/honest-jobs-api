import { ExpressRouter } from '@routes/libs/express.router';
import { NextFunction, Request, Response } from 'express';

class AdRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get(
            '/',
            [],
            (req: Request, res: Response, next: NextFunction) => this.adController.getAllAds(req, res, next)
        );
        this.router.get(
            '/get-ads-by-employer/:recruiterId',
            [],
            (req: Request, res: Response, next: NextFunction) => this.adController.getAdsByEmployer(req, res, next)
        );
        this.router.get(
            '/get-by-id/:adId',
            [],
            (req: Request, res: Response, next: NextFunction) => this.adController.getById(req, res, next)
        );
        this.router.get(
            '/ad-filters',
            [],
            (req: Request, res: Response, next: NextFunction) => this.adController.getFilters(req, res, next)
        );
        this.router.get(
            '/test-filter-creation',
            [],
            (req: Request, res: Response, next: NextFunction) => this.adController.createFilters(req, res, next)
        );
        this.router.post(
            '/add-view',
            [],
            (req: Request, res: Response, next: NextFunction) => this.jobSeekerController.addJobView(req, res, next)
        );
    }
}

export default new AdRouter();
