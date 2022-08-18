import Ad from '@models/ad';
import Recruiter from '@models/recruiter';
import { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';
import { AdQueryHandler } from './libs/mongo-query-handlers/ad-query.handler';

// filters and pagination to implement. avoid redis for it.
export const getAllAds = async (req: any, res: any, next: NextFunction) => {
    try {
        const { filters, pagination, sort } = new AdQueryHandler(req);

        console.log(new AdQueryHandler(req));
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

        // TODO -> need a filters document that is being created by a cronjob
        const location = false || [];
        const companyType = false || [];
        const postedAt = false || [];
        const relatedRoles = false || [];

        res.status(200).json({ location, companyType, postedAt, relatedRoles });
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
