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

        return numberOfPages - 1;
    }

    public async getPageData(): Promise<Property[]> {
        const $ = cheerio.load(this.html);
        const links = $('.listing__link');
        const articles: any[] = [];

        links.each((index, element) => {
            const href = $(element).attr('href');
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

            articles.push({
                address, href,
                sqmPrice: parseFloat(sqmPrice),
                total: parseFloat(total)
            });
        });

        return articles;
    }
}
