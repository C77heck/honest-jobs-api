import Ad, { AdDocument } from '@models/ad';
import { HttpError } from '@models/libs/http-error';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';

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
