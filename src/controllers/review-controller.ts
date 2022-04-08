import { HttpError } from '@models/libs/http-error';
import Review, { ReviewDocument } from '@models/review';
import { NextFunction } from 'express';
import { ERROR_MESSAGES } from '../libs/constants';

export const getById = async (req: any, res: any, next: NextFunction) => {
    let review: ReviewDocument;

    try {
        review = await Review.getReviewById(req.params.reviewId);
    } catch (err) {
        console.log(err);
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ review });
};

export const createNewReview = async (req: any, res: any, next: NextFunction) => {
    const createdReview: any = new Review(req.body as ReviewDocument);

    try {
        await createdReview.save();
    } catch (err) {
        return next(new HttpError(
            'Could not create Review, please try again.',
            500
        ));
    }

    res.status(201).json({ message: 'New review has been successfully added' });
};

export const updateReview = async (req: any, res: any, next: NextFunction) => {
    let updatedReview: ReviewDocument;

    try {
        updatedReview = await Review.updateReview(req.params.reviewId, req.body as ReviewDocument);
    } catch (err) {
        return next(new HttpError(
            ERROR_MESSAGES.GENERIC,
            500
        ));
    }

    res.status(200).json({ updatedReview, message: 'Successfully updated.' });
};

export const deleteReview = async (req: any, res: any, next: NextFunction) => {
    try {
        await Review.deleteReview(req.params.reviewId);
    } catch (err) {
        return next(new HttpError(
            'Could not create Review, please try again.',
            500
        ));
    }

    res.status(201).json({ message: 'New review has been successfully added' });
};
