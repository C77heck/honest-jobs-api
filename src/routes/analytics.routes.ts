import express from 'express';
import { getSessionId } from '../controllers/analytics.controller';

const router = express.Router();

// we will need to add the filtering properties
router.get('/', [], getSessionId);

export default router;
