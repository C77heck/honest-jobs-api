import { ServicesProviders } from '../providers/services.providers';
import CrawlerService from '../services/crawler.service';
import DataProcessorService from '../services/data-processor.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';

export class Application {
    public registeredServices: any[] = [
        HookService,
        CrawlerService,
        DataProcessorService,
        ErrorService,
    ];

    public services: Record<any, any> = {};

    public constructor() {
        this.boot();
    }

    public boot() {

        this.initiateServices();
        this.registerServiceProviders();
        this.bootServices();
    }

    /**
     * initiate the singleton services
     */
    public initiateServices() {
        for (const service of this.registeredServices) {
            const { key, instance } = ServicesProviders.resolve<typeof service>(service);

            this.services[key] = instance;
        }
    }

    /**
     * register services into each other and make all available
     * we will only access whatever is implemented in code though
     */
    public registerServiceProviders() {
        const keys = Object.keys(this.services);

        for (const key of keys) {
            const currentService = this.services[key];
            const servicesToInject = keys.filter(k => k !== key);

            for (const serviceToInject of servicesToInject) {
                currentService[serviceToInject] = this.services[serviceToInject];
            }
        }
    }

    /**
     * Each service class is extended from a Service base class that has an initialize method on it
     * this is where we can make hook subscriptions and other things that we would normally do in its
     * constructor.
     */
    public bootServices() {
        for (const key of Object.keys(this.services)) {
            this.services[key].initialize();
        }
    }
}
