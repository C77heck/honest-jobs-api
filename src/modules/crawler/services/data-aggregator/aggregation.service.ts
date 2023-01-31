import { Inject } from '../../../application/libs/inject.decorator';
import { BadRequest } from '../../models/libs/error-models/errors';
import { Provider } from '../../providers/provider';
import { PropertyDocument } from '../document-services/property.document';

import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';

class AggregationService extends Provider {
    @Inject()
    private hookService: HookService;

    @Inject()
    private mongodbService: PropertyDocument;

    public boot() {
        this.hookService
            .$rawData
            .subscribe(async (data: RawData) => this.handleDataAggregation(data));
    }

    public handleDataAggregation(data: RawData) {
        return;
        switch (data.crawlerName) {
            case 'ingatlanHuFlat':
                return this.mongodbService.saveData(data);
            case 'ingatlanHuHouse':
                return this.mongodbService.saveData(data);
            default:
                throw new BadRequest('Unknown crawler type provided');
        }
    }

}

export default AggregationService;
