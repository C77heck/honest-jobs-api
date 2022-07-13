import Ad, { AdDocument } from '@models/ad';
import { HttpError } from '@models/libs/error-models/errors';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { getUserId } from './libs/helpers';

export const getAdsByEmployer = async (req: any, res: any, next: NextFunction) => {
    try {
        const userId = await getUserId(req);
        const reviews = await Ad.getAdsByEmployer(userId);

        res.status(200).json({ reviews });
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }
};

export const createNewAd = async (req: any, res: any, next: NextFunction) => {
    const createdAd: any = new Ad(req.body as AdDocument);

    try {
        await createdAd.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            'Could not create Ad, please try again.',
            500
        ));
    }

    res.status(201).json({ message: 'New ad has been successfully added' });
};

export const updateAd = async (req: any, res: any, next: NextFunction) => {
    let updatedAd: AdDocument;

    try {
        updatedAd = await Ad.updateAd(req.params.adId, req.body as AdDocument);
    } catch (err) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ updatedAd, message: 'Successfully updated.' });
};

export const deleteAd = async (req: any, res: any, next: NextFunction) => {
    try {
        await Ad.deleteAd(req.params.adId);
    } catch (err) {
        return next(new HttpError(
            'Could not create Ad, please try again.',
            500
        ));
    }

    res.status(201).json({ message: 'New ad has been successfully added' });
};
