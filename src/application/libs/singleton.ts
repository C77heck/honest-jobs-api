export class Singleton extends Function {
    // private static _instance: Singleton = new Singleton();
    protected constructor() {
        super();
    }

    public static get instance() {
        return new this();
    }
}
