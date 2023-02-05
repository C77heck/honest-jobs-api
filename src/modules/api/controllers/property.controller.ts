import { NextFunction } from 'express';
import { Inject } from '../../../application/libs/inject.decorator';
import { handleError } from '../../../libs/handle-error';
import { ExpressController } from '../controllers/libs/express.controller';
import { PropertyDbService } from '../services/property-db.service';

export class PropertyController extends ExpressController {
    @Inject()
    public databaseService: PropertyDbService;

    public routes() {
        this.router.get('/:location', [], this.getByLocation.bind(this));
    }

    private async getByLocation(req: any, res: any, next: NextFunction) {
        try {
            const location = req.params?.location || '';

            const data = await this.databaseService.get({ location });

            res.status(200).json(data);
        } catch (err) {
            return next(handleError(err));
        }
    }
}
