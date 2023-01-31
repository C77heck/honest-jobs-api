import fs from 'fs';
import { Inject } from '../../../application/libs/inject.decorator';
import { BadRequest } from '../../models/libs/error-models/errors';
import { Provider } from '../../providers/provider';
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

    public async log(data: string) {
        return fs.writeFileSync(`${__dirname}/logs.txt`, data);
    }

    public async handleDataProcessing(data: ProcessedDataInterface) {
        const { crawlerName, location, baseUrl, html } = data;

        switch (crawlerName) {
            case 'ingatlanHuFlat':
                const flatProcessor = new IngatlanHuProcessor(html);

                return this.hookService.$rawData.next({
                    location,
                    crawlerName,
                    data: await flatProcessor.getPageData(baseUrl)
                });
            case 'ingatlanHuHouse':
                const houseProcessor = new IngatlanHuProcessor(html);

                return this.hookService.$rawData.next({
                    location,
                    crawlerName,
                    data: await houseProcessor.getPageData(baseUrl)
                });
            default:
                throw new BadRequest('Unknown crawler type provided');
        }
    }

}

export default DataProcessorService;
