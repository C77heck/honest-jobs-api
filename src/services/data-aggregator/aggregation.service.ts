import { BadRequest } from '../../../dist/models/libs/error-models/errors';
import { Inject } from '../../application/libs/inject.decorator';
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
        switch (data.crawlerName) {
            case 'ingatlanHu':
                return this.mongodbService.saveData(data);
            default:
                throw new BadRequest('Unknown crawler type provided');
        }
    }

}

export default AggregationService;
