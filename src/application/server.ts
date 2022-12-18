import cors from 'cors';

import dotenv from 'dotenv';

import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'jet-logger';
import mongoose from 'mongoose';
import { HttpError } from '../models/libs/error-models/errors';
import api from '../routes/api.routes';

dotenv.config({ path: `./config/.env` });

export default class Server {
    public port = process.env.PORT || 3131;
    public app: Express;

    public constructor() {
        this.app = express();
    }

    public static run() {
        const application = new Server();

        application.boot();
    }

    public async boot() {
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
