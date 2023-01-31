import { RegisteredProvider } from '../../application/ioc-container';
import { toLowerCase } from '../../application/libs/helpers';
import { Singleton } from '../../application/libs/singleton';

export interface IProvider extends Function {
    // todo fix this
    instance?: any;
}

export class Provider extends Singleton implements IProvider {
    public boot(options?: any) {
        //
    }

    public static resolve<T>(registeredProvider: RegisteredProvider): { instance: T; key: string } {
        const instance = registeredProvider.implementation.instance;
        instance.uniqueId = registeredProvider.id;
        const key = toLowerCase(Object.getPrototypeOf(instance).constructor.name);

        return { key, instance };
    };
}
