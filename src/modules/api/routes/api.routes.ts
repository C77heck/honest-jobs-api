import express from 'express';
import { Inject } from '../../../application/libs/inject.decorator';
import { PropertyController } from '../controllers/property.controller';

class ExpressApiRouter {
    @Inject()
    public propertyController: PropertyController;

    public router: express.Router;

    public constructor() {
        this.router = express.Router();
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.use('/property', this.propertyController.router);
    }
}

export default ExpressApiRouter;
