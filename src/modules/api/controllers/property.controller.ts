import { NextFunction } from 'express';
import { Inject } from '../../../application/libs/inject.decorator';
import { BadRequest } from '../../../application/models/errors';
import { handleError } from '../../../libs/handle-error';
import { DatasetService } from '../../analytics/services/dataset.service';
import { ExpressController } from '../controllers/libs/express.controller';
import { PropertyDbService } from '../services/property-db.service';
import { WatchedDbService } from '../services/watched-db.service';
import { getPaginationOptions } from './libs/helpers/get-pagination-options';

export class PropertyController extends ExpressController {
    @Inject()
    public databaseService: PropertyDbService;

    @Inject()
    public datasetService: DatasetService;

    @Inject()
    public watchedDbService: WatchedDbService;

    public routes() {
        this.router.get('/location-options', [], this.getLocations.bind(this));
        this.router.get('/analytics/:location/:type', [], this.getAnalytics.bind(this));
        this.router.get('/special-follows/:tab', [], this.getSpecialFollow.bind(this));
        this.router.get('/by-location/:location/:type', [], this.getByLocation.bind(this));
        this.router.get('/get-watched', [], this.getWatched.bind(this));
        this.router.post('/add-to-watched/:href', [], this.addToWatched.bind(this));
        this.router.delete('/remove-from-watch/:id', [], this.removeFromWatched.bind(this));
    }

    private async getWatched(req: any, res: any, next: NextFunction) {
        try {
            const watched = await this.watchedDbService.find();

            res.status(200).json({ watched });
        } catch (err) {
            return next(handleError(err));
        }
    }

    private async addToWatched(req: any, res: any, next: NextFunction) {
        try {
            const href = req?.params?.href;

            if (!href) {
                throw new BadRequest('Missing href');
            }

            const watched = await this.watchedDbService.add({ href });

            res.status(200).json({ watched });
        } catch (err) {
            return next(handleError(err));
        }
    }

    private async removeFromWatched(req: any, res: any, next: NextFunction) {
        try {
            const id = req?.params?.id;

            if (!id) {
                throw new BadRequest('Missing id');
            }

            await this.watchedDbService.remove(id);

            res.status(200);
        } catch (err) {
            return next(handleError(err));
        }
    }

    private async getLocations(req: any, res: any, next: NextFunction) {
        try {
            const locations = [
                { title: 'Kecskemét', value: 'Kecskemét' },
                { title: 'Budapest agglomeració', value: 'Budapest agglomeració' },
                { title: 'Budapest', value: 'Budapest' },
            ];

            res.status(200).json({ locations });
        } catch (err) {
            return next(handleError(err));
        }
    }

    private async getByLocation(req: any, res: any, next: NextFunction) {
        const location = req?.params?.location || '';

        if (!location) {
            throw new BadRequest('Missing location');
        }

        const crawlerName = req.params.type === 'flats' ? 'ingatlanHuFlat' : 'ingatlanHuHouse';

        const sortQuery = req.query?.sort || {};
        const searchQuery = req.query?.search || '';

        const { limit, skip } = getPaginationOptions(req.query);

        const analyzedData = await this.datasetService.getProperties({
            searchQuery,
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
            const location = req?.params?.location || '';

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
            const location = req?.query?.location || '';
            const tab = req.params?.tab || 'studioFlats';
            const page = +(req.query?.page || 0);
            const limit = +(req.query?.limit || 20);
            const searchQuery = req.query?.search || '';

            const data = await this.datasetService.getFollowTab({
                tab,
                page,
                limit,
                location,
                searchQuery
            });

            res.status(200).json({ ...data, page });
        } catch (err) {
            return next(handleError(err));
        }
    }
}
