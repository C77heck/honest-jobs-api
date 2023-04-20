import * as cheerio from 'cheerio';
import { PropertyData } from '../../../../models/documents/ingatlan.hu/property.document';

export class IngatlanHuProcessor {
    private html: any;

    public constructor(html: any) {
        this.html = html;
    }

    public async getPageNumber(): Promise<number> {
        const $ = cheerio.load(this.html);
        const pagination = $('.text-battleship');
        const content = pagination.text().split('/ ');

        const numberOfPages = +content?.[1];

        if (numberOfPages < 2) {
            return 1;
        }

        return numberOfPages;
    }

    public async getPageData(baseUrl: string): Promise<PropertyData[]> {
        const $ = cheerio.load(this.html);
        const links = $('.listing-card');
        const articles: any[] = [];
        links.each((index, element) => {
            console.log({ links: $(element).attr('data-listing-id') });

            const url = $(element).attr('href');
            const totalElement = $(element)
                .children('.listing__header')
                .children('.listing__featured-parameters')
                .children('.listing__price')
                .children('.price__container ')
                .children('.price ')
                .text()
                .replace('M Ft', '')
                .trim();

            const address = $(element)
                .children('.listing__header')
                .children('.listing__featured-parameters')
                .children('.listing__address')
                .text();

            const sizeElement = $(element)
                .children('.listing__parameters')
                .children('.listing__data--area-size')
                .text()
                .split(' ');

            const size = +sizeElement[1];
            const total = parseFloat(totalElement) * 1000000;

            articles.push({
                address,
                size,
                total,
                href: `${baseUrl}${url}`,
                sqmPrice: parseFloat((total / size).toString()),
            });
        });

        return articles;
    }
}
