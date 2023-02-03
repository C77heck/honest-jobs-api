import { PropertyController } from '../api/controllers/property.controller';
import { PropertyDbService } from '../api/services/property-db.service';
import { IProvider } from '../crawler/providers/provider';
import ClientService from '../crawler/services/client.service';
import CrawlerService from '../crawler/services/crawler.service';
import AggregationService from '../crawler/services/data-aggregator/aggregation.service';
import DataProcessorService from '../crawler/services/data-processor/data-processor.service';
import { PropertyService } from '../crawler/services/document-services/property.service';
import ErrorService from '../crawler/services/error.service';
import HookService from '../crawler/services/hook.service';

export interface RegisteredProvider {
    id: symbol,
    implementation: IProvider;
}

export class ProviderRegistry {
    private serviceProviders: IProvider[] = [
        HookService,
        ClientService,
        PropertyService,
        DataProcessorService,
        ErrorService,
        AggregationService,
        CrawlerService,
        PropertyDbService,
    ];

    private controllerProviders: IProvider[] = [
        PropertyController,
    ];

    public services: RegisteredProvider[] = [];
    public controllers: RegisteredProvider[] = [];

    public boot() {
        this.registerServices();
        this.registerControllers();

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

    private registerControllers() {
        this.controllers = this.controllerProviders.map(service => {
            return {
                id: Symbol.for(service.name),
                implementation: service
            };
        });
    }
}
