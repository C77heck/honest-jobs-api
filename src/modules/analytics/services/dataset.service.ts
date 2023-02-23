import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { MongoOptions } from '../../api/services/property-db.service';
import { PropertyGroupDbService } from '../../api/services/property-group-db.service';
import { PropertyDocument } from '../../crawler/models/documents/ingatlan.hu/property.document';

export interface GetPropertyOptions {
    sortQuery: MongoOptions;
    crawlerName: 'ingatlanHuHouse' | 'ingatlanHuFlat';
    location: string;
    limit: number;
    skip: number;
}

export interface PaginationResponse<TData> {
    data: TData[];
    page: number;
    total: number;
}

export class DatasetService extends Provider {
    @Inject()
    public propertyGroupDbService: PropertyGroupDbService;

    public async getProperties(propertyOptions: GetPropertyOptions): Promise<PaginationResponse<PropertyDocument>> {
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
}
