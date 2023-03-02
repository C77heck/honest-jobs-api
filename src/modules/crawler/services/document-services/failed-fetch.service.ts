import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import FailedFetch, {
    FailedFetchModel
} from '../../models/documents/ingatlan.hu/failed-fetch.document';
import CrawlerService from '../crawler.service';
import HookService from '../hook.service';
import { CrawlerConfigInterface } from '../interfaces/crawler-config.interface';

export class FailedFetchService extends Provider {
    @Inject()
    private hookService: HookService;

    @Inject()
    private crawlerService: CrawlerService;

    private document: FailedFetchModel;

    public boot() {
        this.document = FailedFetch;

        this.hookService.$failedFetches.subscribe((data: CrawlerConfigInterface) => this.handleFailedFetch(data));
    }

    private async handleFailedFetch(data: CrawlerConfigInterface) {
        try {
            return this.document.create(data);
        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
    }

    public async run() {
        const documents = await this.document.find({});

        if (!documents?.length) {
            console.log('No failed fetches have been found');
            return;
        }

        for (const document of documents) {
            await this.crawlerService.run(document, false);
        }

        console.log('Failed fetches have been fixed');
        await this.document.deleteMany();
        console.log('Old failed fetches have been removed');
    }
}
