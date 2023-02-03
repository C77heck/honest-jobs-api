import apiRoutes from '../../../api/routes/api.routes';
import { Application } from '../../../application/ioc-container';
import { Server } from '../../../application/server';
import { InternalServerError } from '../../models/libs/error-models/errors';
import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export class Crawler {
    public application: Application;
    public config: any;

    public constructor(config: CrawlerConfigInterface) {
        if (!config) {
            throw new InternalServerError('Missing config');
        }

        this.config = config;
        this.application = Server.instance.boot(apiRoutes);
    }
}
