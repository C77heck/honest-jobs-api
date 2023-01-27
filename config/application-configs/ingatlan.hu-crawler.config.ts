import { CrawlerConfigInterface } from '../../src/services/interfaces/crawler-config.interface';

export const ingatlanHuCrawlerConfig: CrawlerConfigInterface = {
    urls: [
        'https://ingatlan.com/lista/elado+lakas+kecskemet',
    ],
    targetPoints: ['breaking', 'breaking news', 'hungary']
};
