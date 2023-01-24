import { toLowerCase } from '../application/libs/helpers';
import { Singleton } from '../application/libs/singleton';

export interface IProvider extends Function {
}

export class Provider extends Singleton implements IProvider {
    public boot() {
        //
    }

    public static resolve<T>(Class: any): { instance: T; key: string } {
        const key = toLowerCase(Class.name);

        const instance = Class.instance;

        return { key, instance };
    };
}
