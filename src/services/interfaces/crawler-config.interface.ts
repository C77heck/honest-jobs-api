import { CrawlerTypes } from '../../tasks/task-manager';

export interface CrawlerConfigInterface {
    baseUrl: string;
    url: string;
    targetPoints: string[];
    crawlerName: CrawlerTypes;
}
