import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export const ingatlanHuCrawlerConfig: Record<string, Record<string, CrawlerConfigInterface>> = {
    kecskemet: {
        flat: {
            location: 'Kecskemét',
            crawlerName: 'ingatlanHuFlat',
            baseUrl: 'https://ingatlan.com',
            url: 'https://ingatlan.com/lista/elado+lakas+kk:m%C5%B1kertv%C3%A1ros-musz%C3%A1j-rend%C5%91rfalu-+csak-kepes+nem-berleti-jog+kecskemet+35-mFt-ig+ar-szerint',
            targetPoints: []
        },
        house: {
            location: 'Kecskemét',
            url: 'https://ingatlan.com/lista/elado+haz+65-m2-felett+kk:m%C5%B1kertv%C3%A1ros-musz%C3%A1j-rend%C5%91rfalu--het%C3%A9ny+csak-kepes+nem-berleti-jog+kecskemet+20-45-mFt+ar-szerint',
            crawlerName: 'ingatlanHuHouse',
            baseUrl: 'https://ingatlan.com',
            targetPoints: []
        }
    },
    budapestAgglomeration: {
        flat: {
            location: 'Budapest agglomeració',
            crawlerName: 'ingatlanHuFlat',
            url: 'https://ingatlan.com/szukites/elado+lakas+ar-szerint+budapesti-agglomeracio+38-mFt-ig+57-m2-felett',
            baseUrl: 'https://ingatlan.com',
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
            url: 'https://ingatlan.com/lista/elado+lakas+70-m2-alatt+kk:osztatlan-k%C3%B6z%C3%B6s-k%C3%A9szp%C3%A9nzes+nem-berleti-jog+csak-kepes+budapest+12-20-mFt+ar-szerint',
            targetPoints: []
        }
    },
};
