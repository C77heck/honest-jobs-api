import { Subject } from 'rxjs';
import {
    ProcessedDataErrorInterface,
    ProcessedDataInterface
} from './interfaces/processed-data.interface';
import { Provider } from './libs/service';

class HookService extends Provider {
    public $processedData = new Subject<ProcessedDataInterface>();
    public $errorLog = new Subject<ProcessedDataErrorInterface>();
}

export default HookService;
