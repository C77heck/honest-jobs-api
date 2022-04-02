import { Router } from 'express';
import adminRoutes from './admin-routes';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/admin', adminRoutes);

// Export default.
export default baseRouter;
