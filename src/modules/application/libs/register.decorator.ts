import "reflect-metadata";

export interface Constructable {
    new(...args: any[]): {};
}

// todo we need to register this with a unique id that will be used in the inject propertz too.
export function Register(): any {
    return function <T extends Constructable>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                (this as any).uniqueId = Symbol.for(constructor.name);
                this.registerServices();
            }

            registerServices() {
                const properties = Object.keys(this);

                properties.forEach(property => {
                    const type = Reflect.getMetadata("design:type", this, property);

                    if (!type) {
                        return;
                    }

                    (this as any)[property] = type;
                    // (this as any)[property] = new type();
                });
            }
        };
    };
}
