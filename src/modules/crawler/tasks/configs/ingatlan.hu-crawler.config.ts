import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export const ingatlanHuCrawlerConfig: Record<string, Record<string, CrawlerConfigInterface>> = {
    kecskemet: {
        flat: {
            location: 'Kecskemét',
            crawlerName: 'ingatlanHuFlat',
            baseUrl: 'https://ingatlan.com',
            url: 'https://ingatlan.com/lista/elado+lakas+kecskemet',
            targetPoints: []
        },
        house: {
            location: 'Kecskemét',
            url: 'https://ingatlan.com/szukites/elado+haz+kecskemet',
            crawlerName: 'ingatlanHuHouse',
            baseUrl: 'https://ingatlan.com',
            targetPoints: []
        }
    },
    budapest: {
        flat: {
            location: 'Budapest',
            crawlerName: 'ingatlanHuFlat',
            baseUrl: 'https://ingatlan.com',
            url: 'https://ingatlan.com/lista/elado+lakas+budapest',
            targetPoints: []
        },
        house: {
            location: 'Budapest',
            url: 'https://ingatlan.com/szukites/elado+haz+budapest',
            crawlerName: 'ingatlanHuHouse',
            baseUrl: 'https://ingatlan.com',
            targetPoints: []
        }
    },
};
