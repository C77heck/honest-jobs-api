import Ad from '@models/ad';
import Filter from '@models/filter';
import Recruiter from '@models/recruiter';
import { FilterService } from '@services/filter.service';
import { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';
import { AdQueryHandler } from './libs/mongo-query-handlers/ad-query.handler';

export const getAllAds = async (req: any, res: any, next: NextFunction) => {
    try {
        const { filters, pagination, sort } = new AdQueryHandler(req);

        const paginatedData = await Ad.getAllAds(pagination, filters, sort);

        res.status(200).json(paginatedData);
    } catch (err) {
        return next(handleError(err));
    }
};

export const getById = async (req: any, res: any, next: NextFunction) => {
    try {
        const ad = await Ad.getById(req.params.adId);

        res.status(200).json({ payload: ad });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getFilters = async (req: any, res: any, next: NextFunction) => {
    try {
        const filterService = new FilterService(Filter);
        const filter = await filterService.getFilters();

        res.status(200).json({ ...filter });
    } catch (err) {
        return next(handleError(err));
    }
};

// todo -> will need  to move this to a cluster module
export const createFilters = async (req: any, res: any, next: NextFunction) => {
    try {
        const filterService = new FilterService(Filter);
        const result = await filterService.createFilters();

        res.status(200).json({ result });
    } catch (err) {
        return next(handleError(err));
    }
};

export const getAdsByEmployer = async (req: any, res: any, next: NextFunction) => {
    try {
        const recruiterId = req?.params?.recruiterId;

        const recruiter = await Recruiter.findById(recruiterId);

        const postedJobs = await recruiter.getPostedJobs();

        res.status(200).json({ items: postedJobs });
    } catch (err) {
        return next(handleError(err));
    }
};
