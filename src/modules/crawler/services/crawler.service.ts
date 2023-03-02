import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import ClientService from './client.service';
import HookService from './hook.service';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';

class CrawlerService extends Provider {
    @Inject()
    private hookService: HookService;

    @Inject()
    private clientService: ClientService;

    public failedFetches: any[] = [];

    public async run(config: CrawlerConfigInterface, saveFailedFetches = true) {
        try {
            const siteData = await this.clientService.fetch<{ text: string }>(config.url);

            if (!siteData?.text) {
                throw new Error('We did not get any text body from the request');
            }

            this.hookService.$processedData.next({
                location: config.location,
                baseUrl: config.baseUrl,
                crawlerName: config.crawlerName,
                html: siteData.text,
                targetPoints: config.targetPoints,
            });
        } catch (error) {
            if (saveFailedFetches) {
                this.hookService.$failedFetches.next(config);
            }
        }
    }
}

export default CrawlerService;
