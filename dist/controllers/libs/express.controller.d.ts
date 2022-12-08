import express from 'express';
export declare class ExpressController<TUserType> {
    router: express.Router;
    someService: any;
    constructor();
    injectServices(): void;
    initializeRouters(): void;
    handleValidation(req: express.Request): void;
}
