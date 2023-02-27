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
    page: number;
    total: number;
}

export class DatasetService extends Provider {
    @Inject()
    public propertyDbService: PropertyDbService;

    @Inject()
    public propertyGroupDbService: PropertyGroupDbService;

    public async getProperties(propertyOptions: GetPropertyOptions): Promise<PaginationResponse<PropertyGroupData>> {
        const { location, crawlerName, sortQuery, limit, skip } = propertyOptions;

        const { properties, total } = await this.propertyGroupDbService.paginate(
            { location, crawlerName },
            { limit, skip, sort: sortQuery }
        );

        return {
            total: Math.floor(total / limit),
            data: properties,
            page: Math.floor(skip / limit)
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
