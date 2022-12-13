export interface Constructable<T> {
    new(...args: any): T;
}

export interface ServiceProvider<T> extends Constructable<T> {
    initialize: () => void;
}
