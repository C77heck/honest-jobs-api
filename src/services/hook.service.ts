import { Subject } from 'rxjs';
import { Provider } from '../providers/provider';
import {
    ProcessedDataErrorInterface,
    ProcessedDataInterface
} from './interfaces/processed-data.interface';

class HookService extends Provider {
    public $processedData = new Subject<ProcessedDataInterface>();
    public $errorLog = new Subject<ProcessedDataErrorInterface>();
}

export default HookService;
