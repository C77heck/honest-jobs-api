import { Provider } from '../providers/provider';
import { IocContainer } from './ioc-container';
import { Singleton } from './libs/singleton';

export class Application extends Singleton {
    public services: Record<any, any> = {};

    public static get instance() {
        // todo return the static _instance.
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
        const ioc = IocContainer.instance.boot();

        for (const service of ioc.services) {
            const { key, instance } = Provider.resolve<typeof service>(service);
            this.services[key] = instance;
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

    /**
     * register services into each other and make all available
     * we will only access whatever is implemented in code though
     */
    private registerServiceProviders() {
        const serviceBySymbol: any = this.getServicesBySymbol();

        for (const key of Object.keys(this.services)) {
            const currentService = this.services[key];
            const properties = Object.keys(currentService);
            properties.forEach(property => {
                const type = Reflect.getMetadata("design:type", currentService, property);

                if (!type || !serviceBySymbol?.[type]) {
                    return;
                }

                currentService[property] = serviceBySymbol[type];
            });
        }
    }

    /**
     * Each service class is extended from a Provider base class that has a boot method on it
     * this is where we can make hook subscriptions and other things that we would normally do in its
     * constructor.
     */
    private bootServices() {
        Object.keys(this.services).forEach(key => this.services[key].boot());
    }
}
