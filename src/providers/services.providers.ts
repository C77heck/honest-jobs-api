import { toLowerCase } from '../application/libs/helpers';

export class ServicesProviders {
    public static resolve<T>(Class: any): { instance: T; key: string } {
        const key = toLowerCase(Class.name);

        const instance = Class.instance;

        return { key, instance };
    };

}
