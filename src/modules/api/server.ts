import cors from 'cors';

import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import logger from 'jet-logger';
import { Application } from '../../application/application';
import { HttpError } from '../../application/models/errors';
import { ProviderRegistry } from '../../application/provider.registry';
import ClientService from '../crawler/services/client.service';
import CrawlerService from '../crawler/services/crawler.service';
import AggregationService from '../crawler/services/data-aggregator/aggregation.service';
import DataProcessorService from '../crawler/services/data-processor/data-processor.service';
import { PropertyService } from '../crawler/services/document-services/property.service';
import ErrorService from '../crawler/services/error.service';
import HookService from '../crawler/services/hook.service';
import { PropertyController } from './controllers/property.controller';
import { PropertyDbService } from './services/property-db.service';

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
                ClientService,
                PropertyService,
                DataProcessorService,
                ErrorService,
                AggregationService,
                CrawlerService,
                PropertyDbService,
            ])
            .registerControllerProviders([PropertyController])
            .boot();

        this.application = await Application.instance.boot(providerRegistry);

        await this.application.connectDB();
    }

    public async start() {
        await this.app.listen(this.port, () => console.log(`app is listening on port: ${this.port}`));
    }
}
