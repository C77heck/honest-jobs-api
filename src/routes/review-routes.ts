import express from 'express';
import { body, check } from 'express-validator';
import {
    createNewReview,
    deleteReview,
    getById,
    updateReview
} from '../controllers/review-controller';

const router = express.Router();

router.get('/get-by-id/:reviewId', [], getById);
// TODO -> auth for the employer
router.post('/create-new-review', [
    body('*').trim().escape(),
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('meta').escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean(),
    check('images').escape(),
], createNewReview);

router.put('/update-review/:reviewId', [
    body('*').trim().escape(),
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('meta').escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean(),
    check('images').escape(),
], updateReview);

router.delete('/delete-review/:reviewId', [], deleteReview);

export default router;
