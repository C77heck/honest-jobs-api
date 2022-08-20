import { ExpressRouter } from '@routes/libs/express.router';
import { NextFunction, Request, Response } from 'express';
import { body, check } from 'express-validator';

class ReviewRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/get-by-id/:reviewId', [], (req: Request, res: Response, next: NextFunction) => this.reviewController.getById(req, res, next));

        this.router.get('/get-by-employer', [], (req: Request, res: Response, next: NextFunction) => this.reviewController.getByEmployer(req, res, next));
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
        ], (req: Request, res: Response, next: NextFunction) => this.reviewController.createNewReview(req, res, next));

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
        ], (req: Request, res: Response, next: NextFunction) => this.reviewController.updateReview(req, res, next));

        this.router.delete('/delete-review/:reviewId', [], (req: Request, res: Response, next: NextFunction) => this.reviewController.deleteReview(req, res, next));
    }
}

export default new ReviewRouter();
