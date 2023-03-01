import { NextFunction } from 'express';
import { Inject } from '../../../application/libs/inject.decorator';
import { BadRequest } from '../../../application/models/errors';
import { handleError } from '../../../libs/handle-error';
import { DatasetService } from '../../analytics/services/dataset.service';
import { ExpressController } from '../controllers/libs/express.controller';
import { PropertyDbService } from '../services/property-db.service';
import { getPaginationOptions } from './libs/helpers/get-pagination-options';
import { locations } from './libs/locations';

export class PropertyController extends ExpressController {
    @Inject()
    public databaseService: PropertyDbService;

    @Inject()
    public datasetService: DatasetService;

    public routes() {
        this.router.get('/analytics/:location/:type', [], this.getAnalytics.bind(this));
        this.router.get('/special-follows/:tab', [], this.getSpecialFollow.bind(this));
        this.router.get('/by-location/:location/:type', [], this.getByLocation.bind(this));
    }

    private async getByLocation(req: any, res: any, next: NextFunction) {
        const location = locations[req.params.location];

        if (!location) {
            throw new BadRequest('Missing location');
        }

        const crawlerName = req.params.type === 'flats' ? 'ingatlanHuFlat' : 'ingatlanHuHouse';

        const sortQuery = req.query?.sort || {};

        const { limit, skip } = getPaginationOptions(req.query);

        const analyzedData = await this.datasetService.getProperties({
            crawlerName,
            sortQuery,
            location,
            limit,
            skip
        });

        res.status(200).json(analyzedData);
    }

    private async getAnalytics(req: any, res: any, next: NextFunction) {
        try {
            const location = locations[req.params.location];

            if (!location) {
                throw new BadRequest('Missing location');
            }

            const crawlerName = req.params.type === 'flats' ? 'ingatlanHuFlat' : 'ingatlanHuHouse';

            const data = await this.datasetService.getAnalytics({ location, crawlerName });

            res.status(200).json(data);
        } catch (err) {
            return next(handleError(err));
        }
    }

    private async getSpecialFollow(req: any, res: any, next: NextFunction) {
        try {
            const tab = req.params?.tab || 'studioFlats';
            const page = +(req.query?.page || 0);
            const limit = +(req.query?.limit || 20);

            const data = await this.datasetService.getFollowTab({ tab, page, limit });

            res.status(200).json({ ...data, page });
        } catch (err) {
            return next(handleError(err));
        }
    }
}
