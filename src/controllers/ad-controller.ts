import Ad from '@models/ad';
import { HttpError } from '@models/libs/error-models/errors';
import Recruiter from '@models/recruiter';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';
import { extractQuery, getMongoSortOptions, getPaginationFromRequest } from './libs/query';

export const adsFilterHandler = (filters: any) => {
    if (!filters) {
        return filters;
    }
    const query: any = {};
    for (const key in filters) {
        switch (key) {
            case 'what':
                query.title = { $regex: filters[key], $options: 'is' };
                break;
            case 'where':
                query.location = { $regex: filters[key], $options: 'is' };
                break;
            default:
                query[key] = { $regex: filters[key], $options: 'is' };
                break;
        }
    }
};

// filters and pagination to implement. avoid redis for it.
export const getAllAds = async (req: any, res: any, next: NextFunction) => {
    try {
        const pagination = getPaginationFromRequest(req);
        const filters = extractQuery(req, adsFilterHandler);
        const sort = getMongoSortOptions(req);
        console.log(filters);
        const paginatedData = await Ad.getAllAds(pagination, filters, sort);

        res.status(200).json(paginatedData);
    } catch (err) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }
};

export const getById = async (req: any, res: any, next: NextFunction) => {
    try {
        const ad = await Ad.getById(req.params.adId);

        res.status(200).json({ payload: ad });
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
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
