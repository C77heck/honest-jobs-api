import { BadRequest } from '../../../dist/models/libs/error-models/errors';
import { Inject } from '../../application/libs/inject.decorator';
import { Provider } from '../../providers/provider';
import {
    IngatlanHuAggregate
} from '../../tasks/crawler-tasks/ingatlan-crawler/aggregate-processor/ingatlan.hu.aggregate';
import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';
import { PropertyDocument } from '../document-services/property.document';

class AggregationService extends Provider {
    @Inject()
    public hookService: HookService;

    @Inject()
    public mongodbService: PropertyDocument;

    public boot() {
        this.hookService
            .$rawData
            .subscribe(async (data: RawData) => this.handleDataAggregation(data));
    }

    public handleDataAggregation({ crawlerName, data }: RawData) {
        switch (crawlerName) {
            case 'ingatlanHu':
                // todo we need the mongodbService
                const processor = new IngatlanHuAggregate(data);
                // we need an injected mongodb service to manage the data persisting and processing. extracted out of the aggregator.
                // then we end this process.
                return;
            default:
                throw new BadRequest('Unknown crawler type provided');
        }
    }

}

export default AggregationService;
