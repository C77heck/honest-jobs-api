import { Application } from '../../application/application';
import { ProviderRegistry } from '../../application/provider.registry';
import { PropertyController } from '../api/controllers/property.controller';
import { PropertyDbService } from '../api/services/property-db.service';
import ClientService from '../crawler/services/client.service';
import CrawlerService from '../crawler/services/crawler.service';
import AggregationService from '../crawler/services/data-aggregator/aggregation.service';
import DataProcessorService from '../crawler/services/data-processor/data-processor.service';
import { PropertyService } from '../crawler/services/document-services/property.service';
import ErrorService from '../crawler/services/error.service';
import HookService from '../crawler/services/hook.service';

export class Analytics {
    private application: Application;

    public static get instance() {
        return new (this as any)();
    }

    public async boot() {
        const providerRegistry = ProviderRegistry.instance
            .registerServiceProviders([
                HookService,
                ClientService,
                PropertyService,
                DataProcessorService,
                ErrorService,
                AggregationService,
                CrawlerService,
                PropertyDbService,
            ])
            .registerControllerProviders([PropertyController,])
            .boot();

        this.application = await Application.instance.boot(providerRegistry);

    }
}
