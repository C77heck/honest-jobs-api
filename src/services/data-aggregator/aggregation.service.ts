import { Inject } from '../../application/libs/inject.decorator';
import { Provider } from '../../providers/provider';
import HookService from '../hook.service';

class AggregationService extends Provider {
    @Inject()
    public hookService: HookService;

    public boot() {
        this.hookService
            .$rawData
            .subscribe(async (data: any) => this.handleDataAggregation(data));
    }

    public handleDataAggregation(data: any) {
        // save down this to the appropiate database.
        console.log({ WeGotHere: data });
    }

}

export default AggregationService;
