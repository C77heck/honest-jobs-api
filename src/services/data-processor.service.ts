import * as cheerio from 'cheerio';
import fs from 'fs';
import { Inject } from '../application/libs/inject.decorator';
import { Register } from '../application/libs/register.decorator';
import { log } from '../libs/decorators/utility.decorators';
import { Provider } from '../providers/provider';
import HookService from './hook.service';
import { ProcessedDataInterface } from './interfaces/processed-data.interface';

class DataProcessorService extends Provider {
    @Inject()
    public hookService: HookService;

    public boot() {
        this.hookService.$processedData.subscribe(async (value: ProcessedDataInterface) => this.handleDataProcessing(value));
    }

    public async log(data: string) {
        return fs.writeFileSync(`${__dirname}/logs.txt`, data);
    }

    public async handleDataProcessing({ html, targetPoints }: ProcessedDataInterface) {
        const $ = cheerio.load(html);
        // todo to get the inner most element that has all the text we need without redundancies.
        const texts = $('.layout__wrapper.layout-no-rail__wrapper');

        const anchors = $('a');
        // see if we can grab the links and crawl those too.
        texts.each((index, element) => {
            const text = this.stripRedundantText($(element).text());
            this.log(text.toString());
        });
    }

    @log()
    public stripRedundantText(text: string) {
        const clearedText = text
            .replace(/\n/ig, '')
            .replaceAll(' ', '');

        const splitText = clearedText.split(/[^a-zA-Z]/);

        return splitText;
    }
}

export default DataProcessorService;
