import { Service } from '@services/libs/service';
import providers from '../providers/services.providers';

class DataProcessorService extends Service<any> {
    public constructor() {
        providers.HookService.$processedData.subscribe((value: any) => this.handleDataProcessing(value));
    }

    public handleDataProcessing(value: any) {
        console.log({ WE_FUCKING_RUN_ID: value });
    }
}

export default DataProcessorService;
