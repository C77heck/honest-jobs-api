// todo we must determine what is an injectible , injectibles: any

function Inject(service: Object) {
    return function (target: Object, key: keyof Object) {
        target[key] = service.constructor();
    };
}
