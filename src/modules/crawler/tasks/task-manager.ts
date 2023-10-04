import { Application } from '../../../application/application';
import { ProviderRegistry } from '../../../application/provider.registry';
import { log } from '../../../libs/decorators/utility.decorators';
import { ProgressBar } from '../../../libs/load-bar';
import { PropertyDbService } from '../../api/services/property-db.service';
import { ChromiumService } from '../services/chromium.service';
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
    private finishMessage = 'CRAWLER TASK IS COMPLETE';

    public static get instance() {
        return new (this as any)();
    }

    private async initializeCrawlerRegistry() {
        this.crawlerRegistry = [
            new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.flat, this.application.services),
            // new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.house, this.application.services),
            // new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapest.flat, this.application.services),
            // new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapestAgglomeration.flat, this.application.services),
            // new IngatlanHuCrawler(ingatlanHuCrawlerConfig.budapestAgglomeration.house, this.application.services),
        ];
    }

    private async bootKernel() {
        const providerRegistry = ProviderRegistry.instance
            .registerServiceProviders([
                HookService,
                ClientService,
                ChromiumService,
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
        console.log('started');
        for (const crawler of this.crawlerRegistry) {
            await crawler.run(progressBar);
        }

        console.log(this.finishMessage);
    }

    @log()
    public async runFailedFetches() {
        await this.bootKernel();

        await this.application.services.failedFetchService.run();
        console.log('FAILED FETCHES TASK IS COMPLETE');
    }
}
