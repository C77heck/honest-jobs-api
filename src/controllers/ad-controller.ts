import Ad from '@models/ad';
import Recruiter from '@models/recruiter';
import { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';
import { ExpressController } from './libs/express.controller';

export class AdController extends ExpressController {
    public initializeRouters() {
        this.router.get('/', [], this.getAllAds.bind(this));

        this.router.put('/create-alert/:adId', [], this.getAllAds.bind(this));

        this.router.get('/similar-ads/:adId', [], this.getSimilarAds.bind(this));

        this.router.get('/get-ads-by-employer/:recruiterId', [], this.getAdsByEmployer.bind(this));

        this.router.get('/get-by-id/:adId', [], this.getById.bind(this));

        this.router.get('/ad-filters', [], this.getFilters.bind(this));

        this.router.get('/test', [], this.createFilters.bind(this));
    }

    // todo -> will need  to move this to a cluster module
    public async createFilters(req: any, res: any, next: NextFunction) {
        try {
            const result = await this.filterService.createFilters();

            res.status(200).json({ result });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getSimilarAds(req: any, res: any, next: NextFunction) {
        try {
            const adId = req.params?.adId;

            if (!adId) {
                // todo -> how to associate them...
                console.log('no ad id...');
            }

            const response = await Ad.find().limit(9);

            res.status(200).json({ items: response });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getAllAds(req: any, res: any, next: NextFunction) {
        try {
            const { filters, pagination, sort } = this.adQueryService.getFormattedData(req);

            const paginatedData = await Ad.getAllAds(pagination, filters, sort);

            res.status(200).json(paginatedData);
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getById(req: any, res: any, next: NextFunction) {
        try {
            const ad = await Ad.getById(req.params.adId);

            res.status(200).json({ payload: ad });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getFilters(req: any, res: any, next: NextFunction) {
        try {
            const { filters } = this.adQueryService.getFormattedData(req);

            const filter = await this.filterService.getFilters(filters);

            res.status(200).json({ filter });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getAdsByEmployer(req: any, res: any, next: NextFunction) {
        try {
            const recruiterId = req?.params?.recruiterId;

            const recruiter = await Recruiter.findById(recruiterId);

            const postedJobs = await recruiter.getPostedJobs();

            res.status(200).json({ items: postedJobs });
        } catch (err) {
            return next(handleError(err));
        }
    }
}

export default new AdController();
