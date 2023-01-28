import fs from 'fs';
import { BadRequest } from '../../../dist/models/libs/error-models/errors';
import { Inject } from '../../application/libs/inject.decorator';
import { Provider } from '../../providers/provider';
import HookService from '../hook.service';
import { ProcessedDataInterface } from '../interfaces/processed-data.interface';

import { bidenCnnProcessor } from './data-processors/biden-cnn.processor';
import { ingatlanHuProcessor } from './data-processors/ingatlan.hu.processor';

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

    public async handleDataProcessing({ html, targetPoints, crawlerName }: ProcessedDataInterface) {
        // todo propably to send to another service with a hook
        console.log({ crawlerName });
        switch (crawlerName) {
            case 'ingatlanHu':
                return this.hookService.$rawData.next({ data: ingatlanHuProcessor(html) });
            case 'cnnBiden':
                return this.hookService.$rawData.next({ data: bidenCnnProcessor(html) });
            default:
                throw new BadRequest('Unknown crawler type provided');
        }

    }
}

export default DataProcessorService;
