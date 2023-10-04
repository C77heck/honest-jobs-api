import cors from 'cors';

import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'jet-logger';
import { Application } from '../../application/application';
import { HttpError } from '../../application/models/errors';
import { ProviderRegistry } from '../../application/provider.registry';
import { DatasetService } from '../analytics/services/dataset.service';
import { PropertyService } from '../crawler/services/document-services/property.service';
import ErrorService from '../crawler/services/error.service';
import HookService from '../crawler/services/hook.service';
import { CrawlerTriggerController } from './controllers/crawler-trigger.controller';
import { PropertyController } from './controllers/property.controller';
import { PropertyDbService } from './services/property-db.service';
import { PropertyGroupDbService } from './services/property-group-db.service';
import { WatchedDbService } from './services/watched-db.service';

export class Server {
    private port = process.env.PORT || 3131;
    private app: Express;
    private application: Application;

    public static get instance() {
        return new this();
    }

    public async boot() {
        await this.initializeApplication();
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/api', this.application.controllers.propertyController.router);
        this.app.use('/trigger', this.application.controllers.crawlerTriggerController.router);

        this.app.use((err: HttpError, _: Request, res: Response, __: NextFunction) => {
            logger.err(err, true);

            return res.status(err?.code || 500).json({
                error: err.message,
                payload: err?.payload || {}
            });
        });

        return this;
    }

    private async initializeApplication() {
        const providerRegistry = ProviderRegistry.instance
            .registerServiceProviders([
                HookService,
                PropertyService,
                ErrorService,
                PropertyDbService,
                WatchedDbService,
                PropertyGroupDbService,
                DatasetService,
            ])
            .registerControllerProviders([
                CrawlerTriggerController,
                PropertyController
            ])
            .boot();

        this.application = await Application.instance.boot(providerRegistry);

        await this.application.connectDB();
    }

    public async start() {
        await this.app.listen(this.port, () => console.log(`app is listening on port: ${this.port}`));
    }
}
