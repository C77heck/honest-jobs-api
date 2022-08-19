import { ExpressRouter } from '@routes/libs/express.router';
import { body, check } from 'express-validator';
import {
    createNewReview,
    deleteReview,
    getByEmployer,
    getById,
    updateReview
} from '../controllers/review-controller';

class ReviewRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/get-by-id/:reviewId', [], getById);

        this.router.get('/get-by-employer', [], getByEmployer);
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
        ], createNewReview);

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
        ], updateReview);

        this.router.delete('/delete-review/:reviewId', [], deleteReview);
    }
}

export default new ReviewRouter();
