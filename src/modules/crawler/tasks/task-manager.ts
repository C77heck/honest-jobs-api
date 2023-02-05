import { Application } from '../../../application/application';
import { ProviderRegistry } from '../../../application/provider.registry';
import { log } from '../../../libs/decorators/utility.decorators';
import { PropertyDbService } from '../../api/services/property-db.service';
import ClientService from '../services/client.service';
import CrawlerService from '../services/crawler.service';
import AggregationService from '../services/data-aggregator/aggregation.service';
import DataProcessorService from '../services/data-processor/data-processor.service';
import { PropertyService } from '../services/document-services/property.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';
import { ingatlanHuCrawlerConfig } from './configs/ingatlan.hu-crawler.config';
import { IngatlanHuCrawler } from './crawler-tasks/ingatlan.hu-crawler';
import { Task } from './libs/interfaces';

export type CrawlerTypes = 'ingatlanHuFlat' | 'ingatlanHuHouse';

export class TaskManager {
    private application: Application;
    private crawlerRegistry: Task[];

    public static get instance() {
        return new (this as any)();
    }

    private async initializeCrawlerRegistry() {
        const applicationServices = this.application.iocContainer.services;

        this.crawlerRegistry = [
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.flat, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.house, applicationServices),
        ];
    }

    private endProcess() {
        return process.exit(0);
    }

    @log()
    public async run() {
        const providerRegistry = ProviderRegistry.instance
            .registerServiceProviders([
                HookService,
                ClientService,
                PropertyService,
                DataProcessorService,
                ErrorService,
                AggregationService,
                CrawlerService,
                PropertyDbService,])
            .boot();
        
        this.application = await Application.instance.boot(providerRegistry);
        await this.application.connectDB();
        await this.initializeCrawlerRegistry();

        await Promise.all(this.crawlerRegistry.map(crawler => crawler.run()));

        console.log('CRAWLER TASK IS COMPLETE');
    }
}
