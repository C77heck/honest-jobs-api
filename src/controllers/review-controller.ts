import { HttpError } from '@models/libs/error-models/errors';
import Recruiter, { RecruiterDocument } from '@models/recruiter';
import Review, { ReviewDocument } from '@models/review';
import { UserService } from '@services/user.service';
import { NextFunction } from 'express';
import { handleError } from '../libs/handle-error';

export const getById = async (req: any, res: any, next: NextFunction) => {
    try {
        const review = await Review.getReviewById(req.params.reviewId);

        res.status(200).json({ review });
    } catch (err) {
        return next(handleError(err));
    }

};
export const getByEmployer = async (req: any, res: any, next: NextFunction) => {
    try {
        const userService = new UserService<RecruiterDocument>(Recruiter);

        const userId = userService.getUserId(req);

        const reviews = await Review.getReviewsForEmployer(userId);

        res.status(200).json({ reviews });
    } catch (err) {
        return next(handleError(err));
    }
};
export const createNewReview = async (req: any, res: any, next: NextFunction) => {
    try {
        const createdReview: any = new Review(req.body as ReviewDocument);

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
    try {
        const updatedReview = await Review.updateReview(req.params.reviewId, req.body as ReviewDocument);

        res.status(200).json({ updatedReview, message: 'Successfully updated.' });
    } catch (err) {
        return next(handleError(err));
    }
};

export const deleteReview = async (req: any, res: any, next: NextFunction) => {
    try {
        await Review.deleteReview(req.params.reviewId);
    } catch (err) {
        return next(handleError(err));
    }

    res.status(201).json({ message: 'New review has been successfully added' });
};
