import { toLowerCase } from '../application/libs/helpers';
import { Singleton } from '../application/libs/singleton';

export class Provider extends Singleton {
    public boot() {
        //
    }

    public static resolve<T>(Class: any): { instance: T; key: string } {
        const key = toLowerCase(Class.name);

        const instance = Class.instance;

        return { key, instance };
    };
}
