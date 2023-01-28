import { IProvider } from '../providers/provider';
import ClientService from '../services/client.service';
import AggregationService from '../services/data-aggregator/aggregation.service';
import DataProcessorService from '../services/data-processor/data-processor.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';

export interface RegisteredProvider {
    id: symbol,
    implementation: IProvider;
}

export class IocContainer {
    private serviceProviders: IProvider[] = [
        HookService,
        ClientService,
        DataProcessorService,
        ErrorService,
        AggregationService,
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
