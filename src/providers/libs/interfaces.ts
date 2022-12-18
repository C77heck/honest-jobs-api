export interface Constructable<T> {
    new(...args: any): T;
}

export interface Provider {
    initialize?: () => void;
}
