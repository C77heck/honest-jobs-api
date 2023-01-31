import * as cheerio from 'cheerio';
import { Property } from '../../../../models/documents/ingatlan.hu/property.document';

export class IngatlanHuProcessor {
    private html: any;

    public constructor(html: any) {
        this.html = html;
    }

    public async getPageNumber(): Promise<number> {
        const $ = cheerio.load(this.html);
        const pagination = $('.pagination__page-number');

        const content = pagination.text().split(' ');

        const numberOfPages = +content?.[3];

        if (numberOfPages < 2) {
            return 1;
        }

        return numberOfPages;
    }

    public async getPageData(baseUrl: string): Promise<Property[]> {
        const $ = cheerio.load(this.html);
        const links = $('.listing__link');
        const articles: any[] = [];

        links.each((index, element) => {
            const url = $(element).attr('href');
            const total = $(element)
                .children('.listing__header')
                .children('.listing__featured-parameters')
                .children('.listing__price')
                .children('.price__container ')
                .children('.price ')
                .text()
                .replace('M Ft', '')
                .trim();

            const sqmPrice = $(element)
                .children('.listing__header')
                .children('.listing__featured-parameters')
                .children('.listing__price')
                .children('.price__container ')
                .children('.price--sqm ')
                .text()
                .replace('Ft/m2', '')
                .trim()
                .replace(' ', '');

            const address = $(element)
                .children('.listing__header')
                .children('.listing__featured-parameters')
                .children('.listing__address')
                .text();

            const size = $(element)
                .children('.listing__parameters')
                .children('.listing__data--area-size')
                .text()
                .split(' ');

            articles.push({
                address,
                size: +size[1],
                href: `${baseUrl}${url}`,
                sqmPrice: parseFloat(sqmPrice),
                total: parseFloat(total) * 1000000
            });
        });

        return articles;
    }
}
