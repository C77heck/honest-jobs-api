import express from 'express';

class ExpressApiRouter {
    public router: express.Router;

    public constructor() {
        this.router = express.Router();
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        // this.router.use('/users/recruiter', recruiterController.router);
    }
}

export default new ExpressApiRouter();
