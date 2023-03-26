import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export const ingatlanHuCrawlerConfig: Record<string, Record<string, CrawlerConfigInterface>> = {
    kecskemet: {
        flat: {
            location: 'Kecskemét',
            crawlerName: 'ingatlanHuFlat',
            baseUrl: 'https://ingatlan.com',
            url: 'https://ingatlan.com/szukites/elado+lakas+ar-szerint+kecskemet+32-mFt-ig',
            targetPoints: []
        },
        house: {
            location: 'Kecskemét',
            url: 'https://ingatlan.com/szukites/elado+haz+ar-szerint+kecskemet+45-mFt-ig+70-m2-felett',
            crawlerName: 'ingatlanHuHouse',
            baseUrl: 'https://ingatlan.com',
            targetPoints: []
        }
    },
    budapestAgglomeration: {
        flat: {
            location: 'Budapest agglomeració',
            crawlerName: 'ingatlanHuFlat',
            baseUrl: 'https://ingatlan.com',
            url: 'https://ingatlan.com/szukites/elado+lakas+ar-szerint+budapesti-agglomeracio+38-mFt-ig+57-m2-felett',
            targetPoints: []
        },
        house: {
            location: 'Budapest agglomeració',
            url: 'https://ingatlan.com/szukites/elado+haz+ar-szerint+budapesti-agglomeracio+45-mFt-ig+70-m2-felett',
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
            url: 'https://ingatlan.com/szukites/elado+lakas+budapest+35-mFt-ig+70-m2-alatt',
            targetPoints: []
        },
        house: {
            location: 'Budapest',
            url: 'https://ingatlan.com/szukites/elado+haz+budapest+40-mFt-ig+60-m2-felett',
            crawlerName: 'ingatlanHuHouse',
            baseUrl: 'https://ingatlan.com',
            targetPoints: []
        },
        office: {
            location: 'Budapest',
            url: 'https://ingatlan.com/szukites/elado+iroda+ar-szerint+budapest+15-mFt-ig',
            crawlerName: 'ingatlanHuOffice',
            baseUrl: 'https://ingatlan.com',
            targetPoints: []
        }
    },
};
