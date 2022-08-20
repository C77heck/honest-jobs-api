import { HttpError } from '@models/libs/error-models/errors';
import api from '@routes/api.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';

const app = express();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// // { origin: ['http://localhost:3000'] }
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

app.use('/api', api.router);

app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);

    return res.status(err?.code || 500).json({
        error: err.message,
    });
});

export default app;
