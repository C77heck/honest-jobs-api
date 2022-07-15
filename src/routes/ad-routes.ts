import express from 'express';
import { body, check } from 'express-validator';
import { getAllAds, getById } from '../controllers/ad-controller';
import {
    createNewAd,
    deleteAd,
    getAdsByEmployer,
    updateAd
} from '../controllers/recruiter.controller';

const router = express.Router();

// we will need to add the filtering properties
router.get('/get-all-ads', [], getAllAds);

router.get('/get-ads-by-employer', [], getAdsByEmployer);

router.get('/get-by-id/:adId', [], getById);
// TODO -> auth for the employer
router.post('/create-new-ad', [
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('meta').escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean(),
    check('images').escape(),
], createNewAd);

router.put('/update-ad/:adId', [
    body('*').trim().escape(),
    check('title').not().isEmpty().escape(),
    check('description').not().isEmpty().escape(),
    check('meta').escape(),
    check('salary').not().isEmpty().escape(),
    check('location').not().isEmpty().escape(),
    check('expiresOn').isString().not().isEmpty().escape(),
    check('isPremium').isBoolean(),
    check('images').escape(),
], updateAd);

router.delete('/delete-ad/:adId', [], deleteAd);

export default router;
