import userRoutes from '@routes/user-routes';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import baseRouter from './routes/api';

import apiRouter from './routes/api';
import logger from 'jet-logger';
import cors from 'cors';

// Constants
const app = express();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// // { origin: ['http://localhost:3000'] }
app.use(cors());
// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/api', baseRouter);

// Error handling
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status: number = StatusCodes.BAD_REQUEST;
    return res.status(status).json({
        error: err.message,
    });
});

// Export here and start in a diff file (for testing).
export default app;
