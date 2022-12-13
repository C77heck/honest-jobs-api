import { ProcessedDataInterface } from '@services/interfaces/processed-data.interface';
import { Service } from '@services/libs/service';
import { Subject } from 'rxjs';

class HookService extends Service<any> {
    public $processedData = new Subject<ProcessedDataInterface>();
}

export default HookService;
