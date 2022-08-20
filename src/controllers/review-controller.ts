import { HttpError } from '@models/libs/error-models/errors';
import Recruiter, { RecruiterDocument } from '@models/recruiter';
import Review, { ReviewDocument } from '@models/review';
import { UserService } from '@services/user.service';
import express, { NextFunction } from 'express';
import { body, check } from 'express-validator';
import { handleError } from '../libs/handle-error';
import { ExpressController } from './libs/express.controller';

export class ReviewController extends ExpressController<RecruiterDocument> {
    public injectServices() {
        super.injectServices();
        this.userServices = new UserService(Recruiter);
    }

    public initializeRouters() {
        this.router.get('/get-by-id/:reviewId', [], this.getById.bind(this));

        this.router.get('/get-by-employer', [], this.getByEmployer.bind(this));
        // TODO -> auth for the employer
        this.router.post('/create-new-review/:employerId', [
            body('*').trim().escape(),
            check('title').not().isEmpty().escape(),
            check('description').not().isEmpty().escape(),
            check('salary').not().isEmpty().escape(),
            check('location').not().isEmpty().escape(),
            check('roleHeld').not().isEmpty().escape(),
            check('suggestions').escape(),
            check('rating').not().isEmpty().escape(),
            check('pros').not().isEmpty().escape(),
            check('cons').not().isEmpty().escape(),
            check('startDate').isString().not().isEmpty().escape(),
            check('finishDate').escape(),
            check('isCurrentEmployer').isBoolean(),
        ], this.createNewReview.bind(this));

        this.router.put('/update-review/:reviewId', [
            body('*').trim().escape(),
            check('title').not().isEmpty().escape(),
            check('description').not().isEmpty().escape(),
            check('salary').not().isEmpty().escape(),
            check('location').not().isEmpty().escape(),
            check('roleHeld').not().isEmpty().escape(),
            check('suggestions').escape(),
            check('rating').not().isEmpty().escape(),
            check('pros').not().isEmpty().escape(),
            check('cons').not().isEmpty().escape(),
            check('startDate').isString().not().isEmpty().escape(),
            check('finishDate').escape(),
            check('isCurrentEmployer').isBoolean(),
        ], this.updateReview.bind(this));

        this.router.delete('/delete-review/:reviewId', [], this.deleteReview.bind(this));
    }

    public async getById(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const review = await Review.getReviewById(req.params.reviewId);

            res.status(200).json({ review });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async getByEmployer(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const userId = this.userServices.getUserId(req);

            const reviews = await Review.getReviewsForEmployer(userId);

            res.status(200).json({ reviews });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async createNewReview(req: express.Request, res: express.Response, next: NextFunction) {
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
    }

    public async updateReview(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const updatedReview = await Review.updateReview(req.params.reviewId, req.body as ReviewDocument);

            res.status(200).json({ updatedReview, message: 'Successfully updated.' });
        } catch (err) {
            return next(handleError(err));
        }
    }

    public async deleteReview(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            await Review.deleteReview(req.params.reviewId);
        } catch (err) {
            return next(handleError(err));
        }

        res.status(201).json({ message: 'New review has been successfully added' });
    }
}

export default new ReviewController();
