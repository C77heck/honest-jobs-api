import moment from 'moment';
import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { MongoOptions, PropertyDbService } from '../../api/services/property-db.service';
import { PropertyGroupDbService } from '../../api/services/property-group-db.service';
import {
    PropertyGroupData
} from '../../crawler/models/documents/ingatlan.hu/property-group.document';

export interface GetPropertyOptions {
    sortQuery: MongoOptions;
    crawlerName: 'ingatlanHuHouse' | 'ingatlanHuFlat';
    location: string;
    limit: number;
    skip: number;
}

export type AnalyticsOptions = Pick<GetPropertyOptions, 'crawlerName' | 'location'>;

export interface AnalyticsData {
    sqmPrices: number[];
    daysOn: number[];
    totalPrices: number[];
    sizes: number[];
}

export interface PaginationResponse<TData> {
    data: TData[];
    total: number;
}

export type SpecialFollowTab = 'studioFlats' | 'cheapFlats' | 'cheapHouses' | 'newPostings';

export interface FollowTab {
    tab: SpecialFollowTab;
    limit: number;
    page: number;
    location: string;
}

export class DatasetService extends Provider {
    @Inject()
    public propertyDbService: PropertyDbService;

    @Inject()
    public propertyGroupDbService: PropertyGroupDbService;

    public async getFollowTab(options: FollowTab): Promise<PaginationResponse<PropertyGroupData>> {
        const { tab, limit, page, location } = options;
        const million = 1000000;
        const paginationOption = { limit, skip: page * limit, sort: { total: 1, size: -1 } };
        const baseQuery = {
            location,
            lastDayOn: { $gte: moment().add(-1, 'day').toDate() },
            address: { $not: /(műkertváros|kossuthváros|erzsébetváros)/ig },
        };

        switch (tab) {
            case 'studioFlats':
                return this.propertyGroupDbService.paginate({
                    ...baseQuery,
                    crawlerName: 'ingatlanHuFlat',
                    total: { $lt: 20 * million },
                    size: { $lt: 40 }
                }, paginationOption);
            case 'cheapFlats':
                return this.propertyGroupDbService.paginate({
                    ...baseQuery,
                    crawlerName: 'ingatlanHuFlat',
                    size: { $gt: 57 },
                    $or: [
                        { sqmPrice: { $lt: 450000 } },
                        { total: { $lt: 27 * million } },
                    ]
                }, paginationOption);
            case 'cheapHouses':
                return this.propertyGroupDbService.paginate({
                    ...baseQuery,
                    crawlerName: 'ingatlanHuHouse',
                    size: { $lte: 120 },
                    $or: [
                        { sqmPrice: { $lt: 600000 } },
                        { total: { $lt: 35 * million } },
                    ]
                }, paginationOption);
            case 'newPostings':
                return this.propertyGroupDbService.paginate({
                    ...baseQuery,
                    numberOfDaysAdvertised: { $lt: 3 },
                    size: { $lte: 150 },
                    total: { $lt: 60 * million }
                }, paginationOption);
            default:
                return this.propertyGroupDbService.paginate({
                    ...baseQuery,
                    crawlerName: 'ingatlanHuFlat',
                    size: { $lt: 40 }
                }, paginationOption);
        }
    }

    public async getProperties(propertyOptions: GetPropertyOptions): Promise<PaginationResponse<PropertyGroupData>> {
        const { location, crawlerName, sortQuery, limit, skip } = propertyOptions;

        const { data, total } = await this.propertyGroupDbService.paginate(
            { location, crawlerName },
            { limit, skip, sort: sortQuery }
        );

        return {
            data,
            total: Math.floor(total / limit),
        };
    }

    public async getAnalytics({ location, crawlerName }: AnalyticsOptions): Promise<AnalyticsData> {
        const properties = await this.propertyGroupDbService.find({
            location,
            crawlerName
        });

        const sqmPrices = [];
        const totalPrices = [];
        const sizes = [];
        const daysOn = [];

        for (const property of properties) {
            sqmPrices.push(Math.round(property.sqmPrice));
            totalPrices.push(Math.round(property.total));
            sizes.push(property.size);
            daysOn.push(property.numberOfDaysAdvertised);
        }

        return {
            sqmPrices,
            totalPrices,
            sizes,
            daysOn
        };
    }
}
