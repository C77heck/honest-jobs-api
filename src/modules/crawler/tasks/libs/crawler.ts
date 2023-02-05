import { InternalServerError } from '../../../../application/models/errors';
import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export class Crawler {
    public config: any;
    public services: Record<any, any>;

    public constructor(config: CrawlerConfigInterface, services: Record<any, any>) {
        if (!config) {
            throw new InternalServerError('Missing config');
        }

        this.config = config;
        this.services = services;
    }
}
