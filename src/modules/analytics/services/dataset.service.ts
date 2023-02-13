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
}

export class DatasetService extends Provider {
    @Inject()
    public propertyHistoryService: PropertyHistoryService;

    @Inject()
    public propertyDbService: PropertyDbService;

    public async getProperties({ location, crawlerName, sortQuery }: GetPropertyOptions) {
        // todo implement sort
        const properties = await this.propertyDbService.find(
            {
                location,
                crawlerName
            },
            {
                sort: sortQuery,
                limit: 20
            },
        );

        const groups = this.getPropertyGroups(properties);

        const lowestSqmPrice = this.getLowestSqmPrice(groups);

        return lowestSqmPrice;
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

    public getLowestSqmPrice(groups: any[]) {
        return groups
            .sort((a, b) => a[0].sqmPrice - b[0].sqmPrice)
            .flat();
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

        return array;
    }
}
