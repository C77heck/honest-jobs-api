import HookService from './hook.service';
import { Service } from './libs/service';

class DataProcessorService extends Service {
    public hookService: HookService;

    public initialize() {
        this.hookService.$processedData.subscribe((value: any) => this.handleDataProcessing(value));
    }

    public handleDataProcessing(value: any) {
        console.log({ WE_FUCKING_RUN_ID: '' });
    }
}

export default DataProcessorService;
