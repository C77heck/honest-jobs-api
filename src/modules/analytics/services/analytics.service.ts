import moment from 'moment';
import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { PropertyDbService } from '../../api/services/property-db.service';
import { PropertyGroupDbService } from '../../api/services/property-group-db.service';
import {
    PropertyGroupData
} from '../../crawler/models/documents/ingatlan.hu/property-group.document';
import { PropertyDocument } from '../../crawler/models/documents/ingatlan.hu/property.document';

export class AnalyticsService extends Provider {
    @Inject()
    public propertyDbService: PropertyDbService;

    @Inject()
    public propertyGroupDbService: PropertyGroupDbService;

    public async run() {
        await this.propertyGroupDbService.clearDB();
        const unprocessedProperties = await this.propertyDbService.find();
        const processedData = this.getPropertyGroups(unprocessedProperties);

        for (const data of processedData) {
            await this.propertyGroupDbService.create(data);
        }
    }

    public getPropertyGroups(unprocessedProperties: PropertyDocument[]): PropertyGroupData[] {
        const groupedAds: any = {};

        for (const property of unprocessedProperties) {
            groupedAds[property.href] = !groupedAds[property.href] ? [property] : [...groupedAds[property.href], property];
        }

        const flattenedAds = [];

        for (const key of Object.keys(groupedAds)) {
            const lastAdvertised = (groupedAds?.[key] || [])
                .sort((a: any, b: any) => moment(a.createdAt).isAfter(moment(b.createdAt)) ? -1 : 1)?.[0] || {};

            const hrefId = (lastAdvertised?.href || '')?.match(/\/(\d+)/);

            flattenedAds.push({
                location: lastAdvertised.location,
                crawlerName: lastAdvertised.crawlerName,
                address: lastAdvertised.address,
                sqmPrice: lastAdvertised.sqmPrice,
                size: lastAdvertised.size,
                total: lastAdvertised.total,
                href: lastAdvertised.href,
                hrefId: hrefId?.[1] || '',
                lastDayOn: lastAdvertised.createdAt,
                numberOfDaysAdvertised: (groupedAds?.[key] || []).length
            });
        }

        return flattenedAds;
    }
}
