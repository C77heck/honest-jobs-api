import { Application } from '../../application/application';
import { InternalServerError } from '../../models/libs/error-models/errors';
import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';
import { Task } from './interfaces';

export class Crawler implements Task {
    public application: Application;
    public config: any;

    public constructor(config: CrawlerConfigInterface) {
        if (!config) {
            throw new InternalServerError('Missing config');
        }

        this.config = config;
        this.application = new Application();
    }

    public run() {
        this.application.services.crawlerService.run(this.config).then(() => process.exit(0));
    }
}
