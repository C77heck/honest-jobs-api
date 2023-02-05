import { Crawler } from '../libs/crawler';
import { Task } from '../libs/interfaces';
import { IngatlanHuProcessor } from './ingatlan-crawler/data-processor/ingatlan.hu.processor';

export class IngatlanHuCrawler extends Crawler implements Task {
    public async run() {
        const pages = await this.getPageNumber();

        for (const page of pages) {
            if (page === 1) {
                await this.services.crawlerService.run(this.config);

                continue;
            }

            const url = `${this.config.url}?page=${page}`;

            const paginatedConfig = { ...this.config, url };

            await this.services.crawlerService.run(paginatedConfig);
        }
    }

    public async getPageNumber(): Promise<number[]> {
        try {
            const html = await this.services.clientService.fetch(this.config.url);
            const processor = new IngatlanHuProcessor(html.text);
            const numberOfPages = await processor.getPageNumber();

            return Array.from({ length: numberOfPages }).map((i, index) => index + 1);
        } catch (e) {
            return [];
        }
    }
}
