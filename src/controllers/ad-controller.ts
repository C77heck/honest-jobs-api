import Ad, { AdDocument } from '@models/ad';
import { HttpError } from '@models/libs/error-models/errors';
import Recruiter from '@models/recruiter';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { handleError } from '../libs/handle-error';

// filters and pagination to implement. avoid redis for it.
export const getAllAds = async (req: any, res: any, next: NextFunction) => {
    let ads: AdDocument[];

    try {
        ads = await Ad.getAllAds();
    } catch (err) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ ads });
};

export const getById = async (req: any, res: any, next: NextFunction) => {
    let ad: AdDocument[];

    try {
        ad = await Ad.getById(req.params.adId);
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ ad });
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
