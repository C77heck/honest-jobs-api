import adRoutes from '@routes/ad-routes';
import { Router } from 'express';
import userRoutes from './user-routes';

// Export the base-router
const baseRouter = Router();
// Setup routers
baseRouter.use('/users', userRoutes);
baseRouter.use('/ads', adRoutes);

// Export default.
export default baseRouter;
