import * as cheerio from 'cheerio';

export const bidenCnnProcessor = (html: any): any => {
    // not done yet
    const $ = cheerio.load(html);
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
            .trim();

        const address = $(element)
            .children('.listing__header')
            .children('.listing__featured-parameters')
            .children('.listing__address')
            .text();

        articles.push({ address, sqmPrice, total, href });
    });

    return articles;
};
