import superagent from "superagent";
import HookService from './hook.service';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';
import { Service } from './libs/service';

class CrawlerService extends Service{
    public hookService: HookService;
    public urls: string[];
    public targetPoints: string[];
    public errors: any[] = [];
    public results: any[] = [];

    public async run(config: CrawlerConfigInterface) {
        this.urls = config.urls;
        this.targetPoints = config.targetPoints;

        for (const url of this.urls) {
            try {
                await this.getSite(url);
            } catch (error) {
                this.errors.push({ error, url });
            }
        }
        this.hookService.$processedData.next(this.results);
    }

    public async getSite(url: string) {
        const response = await superagent
            .get(url)
            .send();

        // .set('X-API-Key', 'foobar')
        // .set('accept', 'json')

        this.results.push(response);
        // todo process the data
    }
}

export default CrawlerService;
