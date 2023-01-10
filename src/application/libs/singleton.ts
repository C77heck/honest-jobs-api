export class Singleton {
    // private static _instance: Singleton = new Singleton();
    protected constructor() {
        //
    }

    public static get instance() {
        // todo return the static _instance.
        return new this();
    }
}
