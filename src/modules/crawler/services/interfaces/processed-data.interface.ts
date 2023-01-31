import { PropertyData } from '../../models/documents/ingatlan.hu/property.document';
import { CrawlerTypes } from '../../tasks/task-manager';

export interface ProcessedDataInterface {
    baseUrl: string;
    location: string;
    html: string;
    targetPoints: string[];
    crawlerName: CrawlerTypes;
}

export interface RawData {
    location: string;
    data: PropertyData[];
    crawlerName: CrawlerTypes;
}

export interface CatchError {
    type: 'FetchError' | 'MongodbError';
    url?: string;
    payload: any;
}
