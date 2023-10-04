import { sleep } from '../../../../libs/helpers';
import { ProgressBar } from '../../../../libs/load-bar';
import ClientService from '../../services/client.service';
import CrawlerService from '../../services/crawler.service';
import { Crawler } from '../libs/crawler';
import { Task } from '../libs/interfaces';
import { IngatlanHuProcessor } from './ingatlan-crawler/data-processor/ingatlan.hu.processor';

export class IngatlanHuCrawler extends Crawler implements Task {
    public async run(progressBar: ProgressBar) {
        const pages = await this.getPages();
        progressBar.initialize({
            barLength: pages.length,
            name: `${this.config.location}: ${this.config.crawlerName}`,
            colour: '\x1b[36m'
        });

        for (const page of pages) {
            progressBar.next(page);

            await sleep(500);

            if (page === 1) {
                await (this.services.crawlerService as CrawlerService).run(this.config);

                continue;
            }

            const url = `${this.config.url}?page=${page}`;

            const paginatedConfig = { ...this.config, url };

            await (this.services.crawlerService as CrawlerService).run(paginatedConfig);
        }
    }

    public async getPages(): Promise<number[]> {
        try {
            // const html = await this.services.clientService.fetch("https://ingatlan.com/");
            const html = await (this.services.clientService as ClientService).fetch(this.config.url);
            const processor = new IngatlanHuProcessor(html);
            const numberOfPages = await processor.getPageNumber();
            return Array.from({ length: numberOfPages }).map((i, index) => index + 1);
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}
