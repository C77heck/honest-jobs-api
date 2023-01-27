import superagent from "superagent";
import { Inject } from '../application/libs/inject.decorator';
import { Register } from '../application/libs/register.decorator';
import { Provider } from '../providers/provider';
import HookService from './hook.service';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';

class CrawlerService extends Provider {
    @Inject()
    public hookService: HookService;

    public async run(config: CrawlerConfigInterface) {
        for (const url of config.urls) {
            try {
                const siteData = await this.getSite(url);

                if (!siteData?.text) {
                    throw new Error('We did not get any text body from the request');
                }

                this.hookService.$processedData.next({
                    html: siteData.text,
                    targetPoints: config.targetPoints
                });
            } catch (error) {
                this.hookService.$errorLog.next({ url, type: 'FetchError', payload: error });
            }
        }
    }

    public async getSite(url: string) {
        return superagent
            .get(url)
            .send();
    }
}

export default CrawlerService;
