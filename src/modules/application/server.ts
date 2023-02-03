import cors from 'cors';

import dotenv from 'dotenv';

import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'jet-logger';
import { HttpError } from '../crawler/models/libs/error-models/errors';

dotenv.config({ path: `./config/.env` });

export class Server {
    public port = process.env.PORT || 3131;
    public app: Express;

    public static get instance() {
        return new this();
    }

    public async boot(api: { router: any }) {
        this.app = express();
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

        await this.start();
    }

    private async start() {
        await this.app.listen(this.port, () => console.log(`app is listening on port: ${this.port}`));
    }
}
