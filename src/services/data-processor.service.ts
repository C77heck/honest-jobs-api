import * as cheerio from 'cheerio';
import fs from 'fs';
import { Provider } from '../providers/provider';
import HookService from './hook.service';
import { ProcessedDataInterface } from './interfaces/processed-data.interface';

class DataProcessorService extends Provider {
    public hookService: HookService;

    public boot() {
        this.hookService.$processedData.subscribe(async (value: ProcessedDataInterface) => this.handleDataProcessing(value));
    }

    public async log(data: string) {
        return fs.writeFileSync(`${__dirname}/logs.txt`, data);
    }

    public async handleDataProcessing({ html, targetPoints }: ProcessedDataInterface) {
        await this.log(html);

        const $ = cheerio.load(html);
        const texts = $('.layout__wrapper.layout-no-rail__wrapper');
        // todo -> remove redundant \n and + and so on and thene read out the headlines.
        // see if we can grab the links and crawl those too.
        texts.each(function (index, element) {
            const text = $(this).text();
            console.log({ text, elementName: element.name });
        });
    }
}

export default DataProcessorService;
