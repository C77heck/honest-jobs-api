import { Inject } from '../../../application/libs/inject.decorator';
import { BadRequest } from '../../models/libs/error-models/errors';
import { Provider } from '../../providers/provider';
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
        switch (data.crawlerName) {
            case 'ingatlanHuFlat':
                await this.mongodbService.saveData(data);
                break;
            case 'ingatlanHuHouse':
                await this.mongodbService.saveData(data);
                break;
            default:
                throw new BadRequest('Unknown crawler type provided');
        }
    }

}

export default AggregationService;
