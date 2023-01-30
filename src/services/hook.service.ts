import { Subject } from 'rxjs';
import { Provider } from '../providers/provider';
import { CatchError, ProcessedDataInterface, RawData } from './interfaces/processed-data.interface';

class HookService extends Provider {
    public $processedData = new Subject<ProcessedDataInterface>();
    public $rawData = new Subject<RawData>();
    public $errorLog = new Subject<CatchError>();
}

export default HookService;
