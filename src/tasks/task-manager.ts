import { ingatlanHuCrawlerConfig } from './configs/ingatlan.hu-crawler.config';
import { IngatlanHuCrawler } from './crawler-tasks/ingatlan.hu-crawler';
import { Task } from './libs/interfaces';

export type CrawlerTypes = 'ingatlanHu';

export class TaskManager {
    private crawlerRegistry: Record<CrawlerTypes, Task> = {
        ingatlanHu: new IngatlanHuCrawler(ingatlanHuCrawlerConfig),
    };

    public static get instance() {
        return new (this as any)();
    }

    private endProcess() {
        return process.exit(0);
    }

    public run(crawler: CrawlerTypes) {
        console.log(this.crawlerRegistry.ingatlanHu, this.crawlerRegistry[crawler]);
        this.crawlerRegistry[crawler].run();

        // this.endProcess();
    }
}
