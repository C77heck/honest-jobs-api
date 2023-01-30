import { Subject } from 'rxjs';
import { Provider } from '../providers/provider';
import {
    CatchError,
    ProcessedDataErrorInterface,
    RawData
} from './interfaces/processed-data.interface';

class HookService extends Provider {
    public $processedData = new Subject<CatchError>();
    public $rawData = new Subject<RawData>();
    public $errorLog = new Subject<ProcessedDataErrorInterface>();
}

export default HookService;
