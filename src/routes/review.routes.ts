import { ExpressRouter } from '@routes/libs/express.router';
import { body, check } from 'express-validator';

class ReviewRouter extends ExpressRouter {
    public initializeRouter() {
        this.router.get('/get-by-id/:reviewId', [], this.reviewController.getById);

        this.router.get('/get-by-employer', [], this.reviewController.getByEmployer);
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
        ], this.reviewController.createNewReview);

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
        ], this.reviewController.updateReview);

        this.router.delete('/delete-review/:reviewId', [], this.reviewController.deleteReview);
    }
}

export default new ReviewRouter();
