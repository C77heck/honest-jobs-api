import Ad from '@models/ad';
import Recruiter from '@models/recruiter';
import { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';
import { ExpressController } from './libs/express.controller';

export class AdController extends ExpressController {
    public injectServices() {
        super.injectServices();
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
            const filter = await this.filterService.getFilters();

            res.status(200).json({ ...filter });
        } catch (err) {
            return next(handleError(err));
        }
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
