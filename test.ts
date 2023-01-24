import "reflect-metadata";
import { IocContainer } from './src/application/ioc-container';

const myMetadataKey = "my-metadata-key";

@RegisterProvider()
class HookService {
}

@Register()
class Base {
    @Inject()
    HookService: HookService;
    @Inject()
    second: string;
}

export interface Constructable {
    new(...args: any[]): {};
}

function RegisterProvider() {
    // return function (target: any, key: string) {
    return function (target: Function) {
        const name = target.name;

        console.log({
            name,
            target,
            reflect: Reflect.getMetadata("design:type", target),
            ref: Reflect.hasOwnMetadata("design:type", target)
        });
        // Reflect.defineMetadata("design:type", type, target, key);
    };
}

function Inject() {
    // return function (target: any, key: string) {
    return function (...args: any[]) {
        console.log({
            args
        });
        // Reflect.defineMetadata("design:type", type, target, key);
    };
}

function Register(): any {
    return function <T extends Constructable>(constructor: T) {
        const providers = IocContainer.registeredServices;

        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                this.registerServices();
            }

            registerServices() {
                providers.forEach(provider => {
                    const providerName = provider.name;
                    const ownServiceName = constructor.name;

                    console.log({
                        getMetadata: Reflect.getMetadata("design:type", this, provider.name),
                    });
                    // todo we need to initialize if it has been referenced
                    if (providerName !== ownServiceName) {
                        (this as any)[provider.name] = null;
                    }
                });
            }
        };
    };
}

const cc = new Base();
