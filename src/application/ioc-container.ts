import { IProvider } from '../providers/provider';
import CrawlerService from '../services/crawler.service';
import DataProcessorService from '../services/data-processor.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';

export interface RegisteredProvider {
    id: symbol,
    implementation: IProvider;
}

export class IocContainer {
    public services: RegisteredProvider[] = [];
    private serviceProviders: IProvider[] = [
        HookService,
        CrawlerService,
        DataProcessorService,
        ErrorService,
    ];

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
