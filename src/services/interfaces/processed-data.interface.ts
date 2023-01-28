import { CrawlerTypes } from '../../tasks/task-manager';

export interface ProcessedDataInterface {
    html: string;
    targetPoints: string[];
    crawlerName: CrawlerTypes;
}

export interface RawData {
    data: any[];
}

export interface ProcessedDataErrorInterface {
    type: 'FetchError';
    url: string;
    payload: any;
}
