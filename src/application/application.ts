import { IProvider, Provider } from '../providers/provider';
import CrawlerService from '../services/crawler.service';
import DataProcessorService from '../services/data-processor.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';
import { Singleton } from './libs/singleton';

export class Application extends Singleton {
    public static registeredServices: IProvider[] = [
        HookService,
        CrawlerService,
        DataProcessorService,
        ErrorService,
    ];
    public services: Record<any, any> = {};

    public static get instance() {
        return new this();
    }

    public boot() {
        this.initiateServices();
        this.registerServiceProviders();
        this.bootServices();

        return this;
    }

    /**
     * initiate the singleton services
     */
    private initiateServices() {
        for (const service of Application.registeredServices) {
            const { key, instance } = Provider.resolve<typeof service>(service);

            this.services[key] = instance;
        }
    }

    /**
     * register services into each other and make all available
     * we will only access whatever is implemented in code though
     */
    private registerServiceProviders() {
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
     * Each service class is extended from a Provider base class that has a boot method on it
     * this is where we can make hook subscriptions and other things that we would normally do in its
     * constructor.
     */
    private bootServices() {
        for (const key of Object.keys(this.services)) {
            this.services[key].boot();
        }
    }
}
