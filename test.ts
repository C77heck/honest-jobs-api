import { IocContainer } from './src/application/ioc-container';

@Register()
class Base {
    HookService: any;
    second: any;
}

export interface Constructable {
    new(...args: any[]): {};
}

function Register(): any {
    return function <T extends Constructable>(constructor: T) {
        const providers = IocContainer.registeredServices;

        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                console.log(this);
                this.registerServices();
            }

            registerServices() {
                providers.forEach(provider => {
                    const providerName = provider.name;
                    const ownServiceName = constructor.name;
                    // todo we need to initialize if it has been referenced
                    console.log(provider.name in this);
                    if (providerName !== ownServiceName) {
                        (this as any)[provider.name] = null;
                    }
                });
            }
        };
    };
}

const cc = new Base();

console.log(cc, 'first' in cc);
