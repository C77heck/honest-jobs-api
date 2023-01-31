import { CrawlerTypes } from '../../tasks/task-manager';

export interface CrawlerConfigInterface {
    location: string;
    baseUrl: string;
    url: string;
    targetPoints: string[];
    crawlerName: CrawlerTypes;
}
