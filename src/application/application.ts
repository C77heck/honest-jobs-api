import cors from 'cors';

import dotenv from 'dotenv';

import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'jet-logger';
import mongoose from 'mongoose';
import { HttpError } from '../models/libs/error-models/errors';
import api from '../routes/api.routes';

const result2 = dotenv.config({
    path: `./.env`,
});

if (result2.error) {
    throw result2.error;
}

export default class Application {
    public port = process.env.PORT || 3131;
    public app: Express;

    public constructor() {
        this.app = express();
    }

    public static run() {
        const application = new Application();
        console.log('RUNNING');
        application.boot();

        console.log(PROCESS.env);
    }

    public async boot() {
        await this.loadEnv();

        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/api', api.router);

        this.app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
            logger.err(err, true);

            return res.status(err?.code || 500).json({
                error: err.message,
                payload: err?.payload || {}
            });
        });

        await this.connectDB();

        await this.startServer();
    }

    private async loadEnv() {
        // read from file
        //
    }

    private async startServer() {
        await this.app.listen(this.port, () => console.log(`app is listening on port: ${this.port}`));
    }

    private async connectDB() {
        try {
            await mongoose.connect(process.env.MONGO_URL || '');
        } catch (e) {
            console.log(e);
        }
    }
}
