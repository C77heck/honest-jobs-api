import { HttpError } from '@models/libs/http-error';
import Ad, { AdDocument } from '@models/ad';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';

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

export const createNewAd = async (req: any, res: any, next: NextFunction) => {
    const createdAd: any = new Ad(req.body as AdDocument);

    try {
        await createdAd.save();
    } catch (err) {
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
