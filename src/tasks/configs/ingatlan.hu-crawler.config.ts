import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export const ingatlanHuCrawlerConfig: CrawlerConfigInterface = {
    crawlerName: 'ingatlanHu',
    baseUrl: 'https://ingatlan.com',
    url: 'https://ingatlan.com/lista/elado+lakas+kecskemet',
    targetPoints: ['breaking', 'breaking news', 'hungary']
};
