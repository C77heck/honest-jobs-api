import moment from 'moment';
import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { MongoOptions, PropertyDbService } from '../../api/services/property-db.service';
import { PropertyDocument } from '../../crawler/models/documents/ingatlan.hu/property.document';
import { PropertyHistoryService } from './document-services/property-history.service';

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
    public propertyHistoryService: PropertyHistoryService;

    @Inject()
    public propertyDbService: PropertyDbService;

    public async getProperties(propertyOptions: GetPropertyOptions): Promise<PaginationResponse<PropertyDocument>> {
        const { location, crawlerName, sortQuery, limit, skip } = propertyOptions;

        const properties = await this.propertyDbService.find(
            { location, crawlerName },
            { limit, skip, sort: sortQuery }
        );

        const groups = this.getPropertyGroups(properties).flat();

        return { data: groups, page: Math.floor(skip / limit), total: 300 };
    }

    public async getNewAndRemovedOnes() {
        const properties = await this.propertyDbService.find({});

        const groups = this.getPropertyGroups(properties);

        const singleOnes = groups
            .filter(group => group.length === 1)
            .flat()
            .sort((a, b) => a.sqmPrice - b.sqmPrice) as any;

        const newOnes = singleOnes.filter((property: any) => moment(property.createdAt).isAfter(moment().add(-2, 'days')));
        const removedOnes = singleOnes.filter((property: any) => moment(property.createdAt).isBefore(moment().add(-2, 'days')));

        return { newOnes, removedOnes };
    }

    public getPropertyGroups(properties: PropertyDocument[]): any[] {
        const groups: any = {};

        for (const property of properties) {
            groups[property.href] = !groups[property.href] ? [property] : [...groups[property.href], property];
        }

        const array = [];

        for (const key of Object.keys(groups)) {
            array.push(groups[key]);
        }
        array.map(group => {
            const daysOn = group.length;
            // todo since how long. use moment between dates
            return { ...group[0], daysOn };
        });
        return array;
    }
}
