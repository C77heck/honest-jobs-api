import { ServiceProvider } from "./interfaces";

export const initialize = <T extends ServiceProvider<T>>(Class: ServiceProvider<T>) => {
    const instance = new Class();

    instance.initialize();

    return instance;
};
