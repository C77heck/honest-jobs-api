import superagent from "superagent";
import HookService from './hook.service';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';
import { Service } from './libs/service';

class CrawlerService extends Service {
    public hookService: HookService;
    public urls: string[];
    public targetPoints: string[];

    public async run(config: CrawlerConfigInterface) {
        this.urls = config.urls;
        this.targetPoints = config.targetPoints;

        for (const url of this.urls) {
            try {
                const siteData = await this.getSite(url);
                console.log(Object.keys(siteData), siteData.text);
                this.hookService.$processedData.next(siteData);
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
