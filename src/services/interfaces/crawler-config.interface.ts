import { CrawlerTypes } from '../../tasks/task-manager';

export interface CrawlerConfigInterface {
    urls: string[];
    targetPoints: string[];
    crawlerName: CrawlerTypes;
}
