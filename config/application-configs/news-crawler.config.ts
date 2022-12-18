import { CrawlerConfigInterface } from '../../src/services/interfaces/crawler-config.interface';

export const newsCrawlerConfig: CrawlerConfigInterface = {
    urls: ['https://www.npmjs.com/package/superagent'],
    targetPoints: ['breaking', 'breaking news', 'hungary']
};
