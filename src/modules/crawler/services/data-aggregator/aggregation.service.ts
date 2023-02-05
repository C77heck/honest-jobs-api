import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import { PropertyService } from '../document-services/property.service';

import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';

class AggregationService extends Provider {
    @Inject()
    private hookService: HookService;

    @Inject()
    private mongodbService: PropertyService;

    public boot() {
        this.hookService
            .$rawData
            .subscribe(async (data: RawData) => this.handleDataAggregation(data));
    }

    public async handleDataAggregation(data: RawData) {
        await this.mongodbService.saveData(data);
    }

}

export default AggregationService;
