import { Provider } from '../providers/provider';
import HookService from './hook.service';

class DataProcessorService extends Provider {
    public hookService: HookService;

    public boot() {
        this.hookService.$processedData.subscribe((value: any) => this.handleDataProcessing(value));
    }

    public handleDataProcessing(value: any) {
        console.log({ WE_FUCKING_RUN_ID: '' });
    }
}

export default DataProcessorService;
