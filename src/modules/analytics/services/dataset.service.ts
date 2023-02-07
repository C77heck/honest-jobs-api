import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { PropertyDbService } from '../../api/services/property-db.service';
import { PropertyDocument } from '../../crawler/models/documents/ingatlan.hu/property.document';
import { PropertyHistoryService } from './document-services/property-history.service';

export class DatasetService extends Provider {
    @Inject()
    public propertyHistoryService: PropertyHistoryService;

    @Inject()
    public propertyDbService: PropertyDbService;

    public async getDataSet() {
        const properties = await this.propertyDbService.get();

        const groups = this.getPropertyGroups(properties);

        const newOnes = this.getNewOnes(groups);

        const lowestSqmPrice = this.getLowestSqmPrice(groups);

        return { newOnes, lowestSqmPrice };
    }

    public getNewOnes(groups: any[]) {
        return groups
            .filter(group => group.length === 1)
            .flat()
            .sort((a, b) => a.sqmPrice - b.sqmPrice);
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
