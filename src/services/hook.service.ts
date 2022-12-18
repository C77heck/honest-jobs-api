import { Subject } from 'rxjs';
import { ProcessedDataInterface } from './interfaces/processed-data.interface';
import { Service } from './libs/service';

class HookService extends Service {
    public $processedData = new Subject<ProcessedDataInterface>();
}

export default HookService;
