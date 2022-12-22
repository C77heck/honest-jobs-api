export class Singleton {
    protected constructor() {
        //
    }

    public static get instance() {
        return new this();
    }
}
