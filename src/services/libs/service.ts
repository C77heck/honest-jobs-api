import { Provider } from '../../providers/libs/interfaces';

export class Service implements Provider {
    public static get instance() {
        return new this();
    }

    public initialize() {
        //
    }
}
