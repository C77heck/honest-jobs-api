import express from 'express';

export class ExpressRouter {
    public router: express.Router;

    // figure the  services to be available and controllers being injected
    public constructor() {
        this.router = express.Router();
        this.injectControllers();
        this.initializeRouter();
    }

    public initializeRouter() {
    }

    public injectControllers() {

    }
}
