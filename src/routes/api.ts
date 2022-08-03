import adRoutes from '@routes/ad.routes';
import jobSeekerRoutes from '@routes/job-seeker.routes';
import recruiterRoutes from '@routes/recruiter.routes';
import { Router } from 'express';

// Export the base-router
const baseRouter = Router();
// Setup routers
baseRouter.use('/users/recruiter', recruiterRoutes);
baseRouter.use('/users/job-seeker', jobSeekerRoutes);
baseRouter.use('/ads', adRoutes);

// Export default.
export default baseRouter;
