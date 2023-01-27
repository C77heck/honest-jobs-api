import * as cheerio from 'cheerio';
import fs from 'fs';
import { Inject } from '../application/libs/inject.decorator';
import { log } from '../libs/decorators/utility.decorators';
import { Provider } from '../providers/provider';
import HookService from './hook.service';
import { ProcessedDataInterface } from './interfaces/processed-data.interface';

class DataProcessorService extends Provider {
    @Inject()
    public hookService: HookService;

    public boot() {
        this.hookService
            .$processedData
            .subscribe(async (value: ProcessedDataInterface) => this.handleDataProcessing(value));
    }

    public async log(data: string) {
        return fs.writeFileSync(`${__dirname}/logs.txt`, data);
    }

    public async handleDataProcessing({ html, targetPoints }: ProcessedDataInterface) {
        const $ = cheerio.load(html);
        // todo to get the inner most element that has all the text we need without redundancies.
        const texts = $('.listing__card');
        const articles: any[] = [];
        // will need the matching added into config somehow or worst comes worst to move
        // the logic of fetching and grabbing to the individual crawler service
        // see if we can grab the links and crawl those too.
        texts.each((index, element) => {

            const text = $(element).children('a').text();
            // todo will need the base url.
            const hrefs = $(element).children('a').attr('href');
            const strippedText = this.stripRedundantText(text);
            articles.push({ text, hrefs });

            this.log(text.toString());
        });
        console.log(articles);
    }

    @log()
    public stripRedundantText(text: string) {
        // const clearedText = text
        //     .replaceAll('  ', '')
        //     .replace(/\n/ig, '');
        const clearedText = text
            .replaceAll('  ', '');

        const splitText = clearedText.split(/[^a-zA-Z]/);

        return splitText;
    }
}

export default DataProcessorService;
