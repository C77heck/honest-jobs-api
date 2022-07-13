import Ad, { AdDocument } from '@models/ad';
import { HttpError } from '@models/libs/error-models/errors';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';
import { extractUser } from './libs/helpers';

export const getAdsByEmployer = async (req: any, res: any, next: NextFunction) => {
    try {
        const user = await extractUser(req);

        const postedJobs = await user.getPostedJobs();

        res.status(200).json({ postedJobs });
    } catch (err) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }
};

export const createNewAd = async (req: any, res: any, next: NextFunction) => {
    try {
        const createdAd: any = new Ad(req.body as AdDocument);

        await createdAd.save();

        const user = await extractUser(req);

        await user.addPostedJobs(createdAd?._id);

        res.status(201).json({ message: 'New ad has been successfully added' });
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            'Could not create Ad, please try again.',
            500
        ));
    }

};

export const updateAd = async (req: any, res: any, next: NextFunction) => {
    try {
        const updatedAd = await Ad.updateAd(req.params.adId, req.body as AdDocument);

        res.status(200).json({ updatedAd, message: 'Successfully updated.' });
    } catch (err) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }
};

export const deleteAd = async (req: any, res: any, next: NextFunction) => {
    try {
        const ad = await Ad.findById(req.params.adId);

        const user = await extractUser(req);

        await user.removePostedJob(ad?._id);

        await ad.remove();

        res.status(201).json({ message: 'Ad has been successfully deleted' });
    } catch (err) {
        return next(new HttpError(
            'Could not create Ad, please try again.',
            500
        ));
    }

};
