import express from 'express';
import { body, check } from 'express-validator';
import {
    createNewReview,
    deleteReview, getByEmployer,
    getById,
    updateReview
} from '../controllers/review-controller';

const router = express.Router();

router.get('/get-by-id/:reviewId', [], getById);

router.get('/get-by-employer/:employerId', [], getByEmployer);
// TODO -> auth for the employer
router.post('/create-new-review/:employerId', [
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

router.put('/update-review/:reviewId', [
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

router.delete('/delete-review/:reviewId', [], deleteReview);

export default router;
