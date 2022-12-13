import { Service } from '@services/libs/service';
import superagent from "superagent";
import providers from '../providers/services.providers';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';

// todo hook service that will take care of the saving of data to the db in another service
class CrawlerService extends Service<any>{
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
        console.log(providers.HookService.$processedData);
        providers.HookService.$processedData.next(this.results);
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
