import express from 'express';
import { body, check } from 'express-validator';
import { createNewAd, getAllAds, updateAd } from '../controllers/ad-controller';

const router = express.Router();

router.post('/create-new-ad', [
    body('*').trim().escape(),
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean()
], createNewAd);

router.put('/update-ad/:adId', [
    body('*').trim().escape(),
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean()
], updateAd);

// we will need to add the filtering properties
router.get('/get-all-ads', [], getAllAds);

export default router;
