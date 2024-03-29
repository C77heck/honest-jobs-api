import { Subject } from 'rxjs';
import { Provider } from '../../../application/provider';
import { CrawlerConfigInterface } from './interfaces/crawler-config.interface';
import { CatchError, ProcessedDataInterface, RawData } from './interfaces/processed-data.interface';

class HookService extends Provider {
    public $processedData = new Subject<ProcessedDataInterface>();
    public $rawData = new Subject<RawData>();
    public $errorLog = new Subject<CatchError>();
    public $failedFetches = new Subject<CrawlerConfigInterface>();
}

export default HookService;
