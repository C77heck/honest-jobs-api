
import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import HookService from './hook.service';
import { CatchError } from './interfaces/processed-data.interface';

class ErrorService extends Provider {
    @Inject()
    private hookService: HookService;

    public boot() {
        this.hookService.$errorLog.subscribe((data: CatchError) => this.handleIncomingError(data));
    }

    public handleIncomingError(error: CatchError) {
        // todo -> probably save it to file in a child process.
        console.log({ error });
    }
}

export default ErrorService;
