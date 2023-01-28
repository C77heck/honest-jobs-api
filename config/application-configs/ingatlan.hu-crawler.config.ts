import { CrawlerConfigInterface } from '../../src/services/interfaces/crawler-config.interface';

export const ingatlanHuCrawlerConfig: CrawlerConfigInterface = {
    crawlerName: 'ingatlanHu',
    urls: [
        'https://ingatlan.com/lista/elado+lakas+kecskemet',
    ],
    targetPoints: ['breaking', 'breaking news', 'hungary']
};
