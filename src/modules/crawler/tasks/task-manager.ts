import { Application } from '../../../application/application';
import { ProviderRegistry } from '../../../application/provider.registry';
import { log } from '../../../libs/decorators/utility.decorators';
import { ProgressBar } from '../../../libs/load-bar';
import { PropertyDbService } from '../../api/services/property-db.service';
import ClientService from '../services/client.service';
import CrawlerService from '../services/crawler.service';
import AggregationService from '../services/data-aggregator/aggregation.service';
import DataProcessorService from '../services/data-processor/data-processor.service';
import { FailedFetchService } from '../services/document-services/failed-fetch.service';
import { PropertyService } from '../services/document-services/property.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';
import { ingatlanHuCrawlerConfig } from './configs/ingatlan.hu-crawler.config';
import { IngatlanHuCrawler } from './crawler-tasks/ingatlan.hu-crawler';

export type CrawlerTypes = 'ingatlanHuFlat' | 'ingatlanHuHouse' | 'ingatlanHuOffice';

export class TaskManager {
    private application: Application;
    private crawlerRegistry: IngatlanHuCrawler[];

    public static get instance() {
        return new (this as any)();
    }

    private async initializeCrawlerRegistry() {
        const applicationServices = this.application.services;

        this.crawlerRegistry = [
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.flat, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.house, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapest.flat, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapest.house, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapest.office, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapestAgglomeration.flat, applicationServices),
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapestAgglomeration.house, applicationServices),
        ];
    }

    private endProcess() {
        return process.exit(0);
    }

    private async bootKernel() {
        const providerRegistry = ProviderRegistry.instance
            .registerServiceProviders([
                HookService,
                ClientService,
                PropertyService,
                DataProcessorService,
                ErrorService,
                AggregationService,
                CrawlerService,
                FailedFetchService,
                PropertyDbService
            ])
            .boot();

        this.application = await Application.instance.boot(providerRegistry);
        await this.application.connectDB();
    }

    @log()
    public async run() {
        await this.bootKernel();
        await this.initializeCrawlerRegistry();
        const progressBar = new ProgressBar();

        for (const crawler of this.crawlerRegistry) {
            await crawler.run(progressBar);
        }
        console.log('CRAWLER TASK IS COMPLETE');
    }

    @log()
    public async runFailedFetches() {
        await this.bootKernel();

        await this.application.services.failedFetchService.run();
        console.log('FAILED FETCHES TASK IS COMPLETE');
    }
}
