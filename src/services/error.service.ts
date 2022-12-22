import HookService from './hook.service';
import { ProcessedDataErrorInterface } from './interfaces/processed-data.interface';
import { Provider } from './libs/service';

class ErrorService extends Provider {
    public hookService: HookService;

    public boot() {
        this.hookService.$errorLog.subscribe((data: ProcessedDataErrorInterface) => this.handleIncomingError(data));
    }

    public handleIncomingError(data: ProcessedDataErrorInterface) {
        // todo -> probably save it to file in a child process.
        console.log({ ProcessedDataErrorInterface: data });
    }
}

export default ErrorService;
