import { ServiceProvider } from '../../providers/libs/interfaces';

export class Service<T> implements ServiceProvider<T> {
    public constructor() {
        this.initialize();
        //
    }

    public initialize(): void {
        //
    }
}
