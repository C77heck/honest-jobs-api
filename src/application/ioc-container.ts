import { IProvider } from '../providers/provider';
import ClientService from '../services/client.service';
import CrawlerService from '../services/crawler.service';
import AggregationService from '../services/data-aggregator/aggregation.service';
import DataProcessorService from '../services/data-processor/data-processor.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';
import { PropertyDocument } from '../services/document-services/property.document';

export interface RegisteredProvider {
    id: symbol,
    implementation: IProvider;
}

export class IocContainer {
    private serviceProviders: IProvider[] = [
        HookService,
        ClientService,
        PropertyDocument,
        DataProcessorService,
        ErrorService,
        AggregationService,
        CrawlerService,
    ];

    public services: RegisteredProvider[] = [];

    public boot() {
        this.registerServices();

        return this;
    }

    public static get instance() {
        return new this();
    }

    private registerServices() {
        this.services = this.serviceProviders.map(service => {
            return {
                id: Symbol.for(service.name),
                implementation: service
            };
        });
    }
}
