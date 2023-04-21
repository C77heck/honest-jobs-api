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
            const url = $(element).attr('href');
            const totalElement = $(element)
                .children('.listing-card-content')
                .children('.flex-column')
                .children('.row')
                .children('.align-content-betweenn')
                .children('.w-100 ')
                .children('.align-items-center')
                .children('.font-family-secondary ')
                .text()
                .replace('M Ft', '')
                .trim();

            const address = $(element)
                .children('.listing-card-content')
                .children('.flex-column')
                .children('.row')
                .children('.align-content-betweenn')
                .children('.w-100')
                .children('.font-family-secondary')
                .text();

            const sizeElement = $(element)
                .children('.listing-card-content')
                .children('.flex-column')
                .children('.row')
                .children('.align-content-betweenn')
                .children('.w-100')
                .children('.justify-content-start')
                .children('.me-4')
                .children('.text-onyx')
                .text()
                .split(' ');

            const size = +sizeElement?.[0];
            const total = parseFloat(totalElement) * 1000000;

            articles.push({
                address, size, total,
                href: `${baseUrl}${url}`,
                sqmPrice: parseFloat((total / size).toString()),
            });
        });

        return articles;
    }
}
