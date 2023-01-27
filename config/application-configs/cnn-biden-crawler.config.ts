import { CrawlerConfigInterface } from '../../src/services/interfaces/crawler-config.interface';

export const cnnBidenCrawlerConfig: CrawlerConfigInterface = {
    urls: [
        'https://edition.cnn.com/politics/joe-biden',
    ],
    targetPoints: ['breaking', 'breaking news', 'hungary']
};
