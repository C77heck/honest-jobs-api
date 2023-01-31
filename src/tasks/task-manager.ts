import { ingatlanHuCrawlerConfig } from './configs/ingatlan.hu-crawler.config';
import { IngatlanHuCrawler } from './crawler-tasks/ingatlan.hu-crawler';
import { Task } from './libs/interfaces';

export type CrawlerTypes = 'ingatlanHuFlat' | 'ingatlanHuHouse';

export class TaskManager {
    private crawlerRegistry: Record<string, Record<CrawlerTypes, Task>> = {
        kecskemet: {
            ingatlanHuFlat: new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.flat),
            ingatlanHuHouse: new IngatlanHuCrawler(ingatlanHuCrawlerConfig.kecskemet.house),
        }
    };

    public static get instance() {
        return new (this as any)();
    }

    private endProcess() {
        return process.exit(0);
    }

    public async run(crawler: CrawlerTypes) {
        await this.crawlerRegistry[crawler].ingatlanHuFlat.run();
        await this.crawlerRegistry[crawler].ingatlanHuHouse.run();
        // this.endProcess();
    }
}
