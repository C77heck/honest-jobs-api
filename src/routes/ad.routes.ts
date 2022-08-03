import express from 'express';
import { check } from 'express-validator';
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


export default router;
