import { CrawlerConfigInterface } from '../../src/services/interfaces/crawler-config.interface';

export const newsCrawlerConfig: CrawlerConfigInterface = {
    urls: [
        'https://edition.cnn.com/politics/joe-biden',
    ],
    targetPoints: ['breaking', 'breaking news', 'hungary']
};
