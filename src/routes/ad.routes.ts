import express from 'express';
import {
    createFilters,
    getAdsByEmployer,
    getAllAds,
    getById,
    getFilters
} from '../controllers/ad-controller';
import { addJobView } from '../controllers/job-seeker.controller';

const router = express.Router();

// we will need to add the filtering properties
router.get('/get-all-ads', [], getAllAds);

router.get('/get-ads-by-employer/:recruiterId', [], getAdsByEmployer);

router.get('/get-by-id/:adId', [], getById);

router.get('/ad-filters', [], getFilters);

router.get('/test-filter-creation', [], createFilters);

router.post('/add-view', [], addJobView);

export default router;
