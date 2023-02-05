import { ExpressController } from '../api/controllers/libs/express.controller';
import { Provider } from '../crawler/providers/provider';
import { ProviderRegistry } from './provider.registry';

export class IocContainer {
    public services: Record<any, any> = {};
    public controllers: Record<string, ExpressController> = {};

    public static get instance() {
        return new this();
    }

    public boot() {
        this.initiate();
        this.register();
        this.bootProviders();

        return this;
    }

    public initiate() {
        const ioc = ProviderRegistry.instance.boot();
        this.initiateProviders(this.services, ioc);
        this.initiateProviders(this.controllers, ioc);
    }

    /**
     * initiate the singleton services
     */
    private initiateProviders(providers: Record<any, any>, ioc: ProviderRegistry) {
        for (const service of ioc.services) {
            const { key, instance } = Provider.resolve<typeof service>(service);

            providers[key] = instance;
        }
    }

    private getServicesBySymbol() {
        const servicesBySymbol: Object = {};

        for (const key of Object.keys(this.services)) {
            const instance = this.services[key];
            servicesBySymbol[instance.uniqueId as keyof Object] = instance;
        }

        return servicesBySymbol;
    }

    private register() {
        const serviceBySymbol: any = this.getServicesBySymbol();

        this.registerProviders(this.services, serviceBySymbol);
        this.registerProviders(this.controllers, serviceBySymbol);
    }

    /**
     * register services into each other and make all available
     * we will only access whatever is implemented in code though
     */
    private registerProviders(initiatiedProviders: Record<any, any>, serviceBySymbol: any) {
        for (const key of Object.keys(initiatiedProviders)) {
            const currentProvider = initiatiedProviders[key];
            const properties = Object.keys(currentProvider);
            properties.forEach(property => {
                const type = Reflect.getMetadata("design:type", currentProvider, property);

                if (!type || !serviceBySymbol?.[type]) {
                    return;
                }

                currentProvider[property] = serviceBySymbol[type];
            });
        }
    }

    /**
     * Each service class is extended from a Provider base class that has a boot method on it
     * this is where we can make hook subscriptions and other things that we would normally do in its
     * constructor.
     */
    private bootProviders() {
        Object.keys(this.services).forEach(key => this.services[key].boot());
        Object.keys(this.controllers).forEach(key => this.controllers[key].boot());
    }
}
