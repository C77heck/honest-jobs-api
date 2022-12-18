import HookService from './hook.service';
import { ProcessedDataErrorInterface } from './interfaces/processed-data.interface';
import { Service } from './libs/service';

class ErrorService extends Service {
    public hookService: HookService;

    public initialize() {
        this.hookService.$errorLog.subscribe((data: ProcessedDataErrorInterface) => this.handleIncomingError(data));
    }

    public handleIncomingError(data: ProcessedDataErrorInterface) {
        // todo -> probably save it to file in a child process.
        console.log({ ProcessedDataErrorInterface: data });
    }
}

export default ErrorService;
