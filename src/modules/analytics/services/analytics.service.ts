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
        const unprocessedProperties = await this.propertyDbService.find();
        const groups = this.getPropertyGroups(unprocessedProperties);

        if (!existingGroups) {
            const historyDocuments = this.getHistoryDocuments(groups);
            return console.log('historyDocuments');
            return this.saveGroups(historyDocuments);
        }

        for (const group of existingGroups) {

        }
    }

    public getHistoryDocuments(groups: Record<any, any>) {
        // todo extract the datas we need then decide what to do.
        const historyDocs = [];

        for (const key of Object.keys(groups)) {
            historyDocs.push({ propertyId: key, propertyDocument: groups[key] });
        }

        return historyDocs;
    }

    public getPropertyGroups(unprocessedProperties: PropertyDocument[]): Record<any, any> {
        const groups: any = {};
        const forAnalysis: any = {};

        for (const property of unprocessedProperties) {
            groups[property.href] = !groups[property.href] ? [property._id] : [...groups[property.href], property._id];
            forAnalysis[property.href] = !forAnalysis[property.href] ? [property] : [...forAnalysis[property.href], property];
        }

        return forAnalysis;
    }

    public async saveGroups(groups: any[]) {
        return Promise.all(groups.map(group => this.propertyHistoryService.saveHistory(group)));
    }
}
