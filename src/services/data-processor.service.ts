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
        const $ = cheerio.load(html);
        const texts = $('.layout__wrapper.layout-no-rail__wrapper');

        const anchors = $('a');
        // see if we can grab the links and crawl those too.
        texts.each((index, element) => {
            const text = this.stripRedundantText($(element).text());
            this.log(text.toString());
        });
    }

    public stripRedundantText(text: string) {
        console.log('what the fukc');
        //'fdsasdf jfuc    kfdsa    asd k     kdasd   das  das'
        // text.replace(/\W/ig, '').split(/[^a-zA-Z]/).join(' ')
        // we use \W to find non letters and numbers and we split wherever is not a word
        // it needs improvement.
        const clearedText = text
            .replace(/\n/ig, '')
            .replaceAll(' ', '');

        const trimmedText = clearedText.split(' ').join(' ');

        console.log({ base: text.length, trimmed: trimmedText.length });

        return trimmedText;
    }
}

export default DataProcessorService;
