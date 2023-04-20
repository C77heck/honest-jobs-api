import fs from 'fs';
import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import {
    IngatlanHuProcessor
} from '../../tasks/crawler-tasks/ingatlan-crawler/data-processor/ingatlan.hu.processor';
import HookService from '../hook.service';
import { ProcessedDataInterface } from '../interfaces/processed-data.interface';

class DataProcessorService extends Provider {
    @Inject()
    private hookService: HookService;

    public boot() {
        this.hookService
            .$processedData
            .subscribe(async (value: ProcessedDataInterface) => this.handleDataProcessing(value));
    }

    private async log(data: string) {
        return fs.writeFileSync(`${__dirname}/logs.txt`, data);
    }

    public async handleDataProcessing(data: ProcessedDataInterface) {
        const { crawlerName, location, baseUrl, html } = data;
        const houseProcessor = new IngatlanHuProcessor(html);
        const pageData = await houseProcessor.getPageData(baseUrl);
        return;
        return this.hookService.$rawData.next({
            location,
            crawlerName,
            data: pageData
        });
    }
}

export default DataProcessorService;
