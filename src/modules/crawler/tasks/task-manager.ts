import { Application } from '../../application/application';
import { ingatlanHuCrawlerConfig } from './configs/ingatlan.hu-crawler.config';
import { IngatlanHuCrawler } from './crawler-tasks/ingatlan.hu-crawler';
import { Task } from './libs/interfaces';

export type CrawlerTypes = 'ingatlanHuFlat' | 'ingatlanHuHouse';

export class TaskManager {
    private application = Application.instance;
    private crawlerRegistry: Record<string, Record<CrawlerTypes, Task>>;

    public static get instance() {
        return new (this as any)();
    }

    private initializeCrawlerRegistry() {
        const applicationServices = this.application.iocContainer.services;

        this.crawlerRegistry = {
            kecskemet: {
                ingatlanHuFlat: new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.flat, applicationServices),
                ingatlanHuHouse: new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.house, applicationServices),
            }
        };
    }

    public async run(crawler: CrawlerTypes) {
        console.time('crawler');
        await this.application.boot();
        await this.application.connectDB();
        await this.initializeCrawlerRegistry();
        await this.crawlerRegistry[crawler].ingatlanHuFlat.run();
        await this.crawlerRegistry[crawler].ingatlanHuHouse.run();
        console.timeEnd('crawler');

        console.log('CRAWLER TASK IS COMPLETE');
    }
}
