import { Subject } from 'rxjs';
import { Provider } from '../providers/provider';
import {
    ProcessedDataErrorInterface,
    ProcessedDataInterface,
    RawData
} from './interfaces/processed-data.interface';

class HookService extends Provider {
    public $processedData = new Subject<ProcessedDataInterface>();
    public $rawData = new Subject<RawData>();
    public $errorLog = new Subject<ProcessedDataErrorInterface>();
}

export default HookService;
