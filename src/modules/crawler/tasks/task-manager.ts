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
        this.crawlerRegistry = {
            kecskemet: {
                ingatlanHuFlat: new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.flat, this.application.iocContainer.services),
                ingatlanHuHouse: new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.house, this.application.iocContainer.services),
            }
        };
    }

    public async run(crawler: CrawlerTypes) {
        await this.application.boot();
        await this.application.connectDB();
        await this.initializeCrawlerRegistry();
        await this.crawlerRegistry[crawler].ingatlanHuFlat.run();
        await this.crawlerRegistry[crawler].ingatlanHuHouse.run();
        // todo create a proxy server with nginx and see how we could save progress here to continue with a new proxy
        // and how to dynamically do that.
        console.log('CRAWLER DONE');
    }
}
