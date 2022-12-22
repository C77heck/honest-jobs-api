import superagent from "superagent";
import { Provider } from '../providers/provider';
import HookService from './hook.service';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';

class CrawlerService extends Provider {
    public hookService: HookService;
    public urls: string[];
    public targetPoints: string[];

    public async run(config: CrawlerConfigInterface) {
        this.urls = config.urls;
        this.targetPoints = config.targetPoints;

        for (const url of this.urls) {
            try {
                const siteData = await this.getSite(url);

                if (!siteData?.text) {
                    throw new Error('We did not get any text body from the request');
                }

                this.hookService.$processedData.next(siteData.text);
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
