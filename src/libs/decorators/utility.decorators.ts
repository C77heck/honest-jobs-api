function readonly(target: any, name: string, descriptor: any) {
    descriptor.writable = false;
    return descriptor;
}

//
// function log(name: string) {
//     return function decorator(t, n, descriptor) {
//         const original = descriptor.value;
//         if (typeof original === 'function') {
//             descriptor.value = function(...args) {
//                 console.log(`Arguments for ${name}: ${args}`);
//                 try {
//                     const result = original.apply(this, args);
//                     console.log(`Result from ${name}: ${result}`);
//                     return result;
//                 } catch (e) {
//                     console.log(`Error from ${name}: ${e}`);
//                     throw e;
//                 }
//             }
//         }
//         return descriptor;
//     };
// }
