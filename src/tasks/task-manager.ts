import cnnBiden from './cnn-biden.crawler';
import ingatlanHu from './hungarian-real-estate.crawler';
import { Crawler } from './libs/crawler';

export type CrawlerTypes = 'cnnBiden' | 'ingatlanHu';

export class TaskManager {
    private crawlers: Record<CrawlerTypes, Crawler> = {
        cnnBiden,
        ingatlanHu,
    };

    public static get instance() {
        return new (this as any)();
    }

    private endProcess() {
        return process.exit(0);
    }

    public runAll() {
        for (const key of Object.keys(this.crawlers)) {
            this.crawlers[key as CrawlerTypes].run();
        }

        this.endProcess();
    }

    public run(crawler: CrawlerTypes) {
        this.crawlers[crawler].run();

        // this.endProcess();
    }
}
