import { CrawlerConfigInterface } from '../../services/interfaces/crawler-config.interface';

export const othersCrawlerConfig: Record<string, Record<string, CrawlerConfigInterface>> = {
    first: {
        flat: {
            location: 'Kecskemét',
            crawlerName: 'ingatlanHuFlat',
            baseUrl: 'https://ingatlan.com',
            url: 'https://ingatlan.com/lista/elado+lakas+kk:m%C5%B1kertv%C3%A1ros-musz%C3%A1j-rend%C5%91rfalu-+csak-kepes+nem-berleti-jog+kecskemet+35-mFt-ig+ar-szerint',
            targetPoints: []
        },
    },
};
