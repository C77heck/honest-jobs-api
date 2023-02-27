import { sleep } from '../../../../libs/helpers';
import { ProgressBar } from '../../../../libs/load-bar';
import { Crawler } from '../libs/crawler';
import { Task } from '../libs/interfaces';
import { IngatlanHuProcessor } from './ingatlan-crawler/data-processor/ingatlan.hu.processor';

export class IngatlanHuCrawler extends Crawler implements Task {
    public async run(progressBar: ProgressBar) {
        const pages = await this.getPageNumber();
        progressBar.initialize(pages.length, '\x1b[36m');

        for (const page of pages) {
            progressBar.next(page);

            await sleep(500);

            if (page === 1) {
                await this.services.crawlerService.run(this.config);

                continue;
            }

            const url = `${this.config.url}?page=${page}`;

            const paginatedConfig = { ...this.config, url };

            await this.services.crawlerService.run(paginatedConfig);
        }

        console.log(this.services.crawlerService.failedFetches);
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
