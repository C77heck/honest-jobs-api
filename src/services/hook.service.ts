import { Subject } from 'rxjs';
import {
    ProcessedDataErrorInterface,
    ProcessedDataInterface
} from './interfaces/processed-data.interface';
import { Service } from './libs/service';

class HookService extends Service {
    public $processedData = new Subject<ProcessedDataInterface>();
    public $errorLog = new Subject<ProcessedDataErrorInterface>();
}

export default HookService;
