import cors from 'cors';

import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'jet-logger';
import { HttpError } from '../crawler/models/libs/error-models/errors';
import { Application } from './application';

export class Server {
    private port = process.env.PORT || 3131;
    private app: Express;
    private application: Application;

    public static get instance() {
        return new this();
    }

    public async boot() {
        this.application = await Application.instance.boot();
        await this.application.connectDB();
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/api', this.application.iocContainer.controllers.propertyController.router);

        this.app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
            logger.err(err, true);

            return res.status(err?.code || 500).json({
                error: err.message,
                payload: err?.payload || {}
            });
        });

        return this;
    }

    public async start() {
        await this.app.listen(this.port, () => console.log(`app is listening on port: ${this.port}`));
    }
}
