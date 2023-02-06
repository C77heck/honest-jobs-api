import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { PropertyDbService } from '../../api/services/property-db.service';
import { PropertyDocument } from '../../crawler/models/documents/ingatlan.hu/property.document';
import { PropertyHistoryService } from './document-services/property-history.service';

export class AnalyticsService extends Provider {
    @Inject()
    public propertyHistoryService: PropertyHistoryService;

    @Inject()
    public propertyDbService: PropertyDbService;

    public async groupProperties() {
        const existingGroups = await this.propertyHistoryService.getAll();
        const unprocessedProperties = await this.propertyDbService.get();

        if (!existingGroups) {
            const groups = this.getPropertyGroups(unprocessedProperties);

            return this.saveGroups(groups);
        }

        for (const group of existingGroups) {

        }
    }

    public getPropertyGroups(unprocessedProperties: PropertyDocument[]) {

        return unprocessedProperties;
    }

    public async saveGroups(groups: any[]) {
        return Promise.all(groups.map(group => this.propertyHistoryService.saveHistory(group)));
    }
}
