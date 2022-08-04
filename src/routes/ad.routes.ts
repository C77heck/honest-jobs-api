import express from 'express';
import { getAdsByEmployer, getAllAds, getById } from '../controllers/ad-controller';

const router = express.Router();

// we will need to add the filtering properties
router.get('/get-all-ads', [], getAllAds);

router.get('/get-ads-by-employer/:recruiterId', [], getAdsByEmployer);

router.get('/get-by-id/:adId', [], getById);

export default router;
