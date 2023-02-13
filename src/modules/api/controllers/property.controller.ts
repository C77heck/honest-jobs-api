import { NextFunction } from 'express';
import { Inject } from '../../../application/libs/inject.decorator';
import { BadRequest } from '../../../application/models/errors';
import { handleError } from '../../../libs/handle-error';
import { DatasetService } from '../../analytics/services/dataset.service';
import { ExpressController } from '../controllers/libs/express.controller';
import { PropertyDbService } from '../services/property-db.service';
import { locations } from './libs/locations';

export class PropertyController extends ExpressController {
    @Inject()
    public databaseService: PropertyDbService;

    @Inject()
    public datasetService: DatasetService;

    public routes() {
        this.router.get('/analytics/:location/:type', [], this.getAnalytics.bind(this));
        this.router.get('/by-location/:location', [], this.getByLocation.bind(this));
    }

    private async getAnalytics(req: any, res: any, next: NextFunction) {
        const location = locations[req.params.location];

        if (!location) {
            throw new BadRequest('Missing location');
        }

        const crawlerName = req.params.type === 'flats' ? 'ingatlanHuFlat' : 'ingatlanHuHouse';

        const sortQuery = req.query?.sort || {};

        const analyzedData = await this.datasetService.getProperties({
            location,
            crawlerName,
            sortQuery
        });

        res.status(200).json(analyzedData);
    }

    private async getByLocation(req: any, res: any, next: NextFunction) {
        try {
            const location = req.params?.location || '';

            const data = await this.databaseService.find({ location });

            res.status(200).json(data);
        } catch (err) {
            return next(handleError(err));
        }
    }
}
