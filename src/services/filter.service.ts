import Ad from '@models/ad';
import { FilterDocument, FilterItem } from '@models/filter';
import { AdService } from '@services/ad.service';
import { DocumentService } from '@services/libs/document.service';
import { handleError } from '../libs/handle-error';

// connect document
export class FilterService extends DocumentService<FilterDocument> {
    public adService = new AdService(Ad);

    public async getFilters(): Promise<FilterDocument> {
        const filters = await this.collection.find();

        return filters?.[0] || {};
    }

    public async remove() {
        try {
            const filter = await this.getFilters();

            return filter.remove();
        } catch (e) {
            handleError(e);
        }
    }

    public async createFilters() {
        await this.remove();

        const ads = await this.adService.getAllAds();

        const filters = {
            location: {},
            companyType: {},
            postedAt: {},
            relatedRoles: {}
        };
        // TODO
        // companyType = need to be implemented
        // postedAt needs just the range to  be implemented perhaps we wont need this.
        // related roles need categories to be implemented on both the front and the backend
        // job types liek full-time part-time ...etc
        for (const ad of ads) {
            const location = filters.location as any;
            location[ad.location] = location[ad.location] ? location[ad.location] + 1 : 1;
        }

        return this.collection.create({
            location: this.formatFilterData(filters.location),
            companyType: this.formatFilterData(filters.companyType),
            postedAt: this.formatFilterData(filters.postedAt),
            relatedRoles: this.formatFilterData(filters.relatedRoles)
        });
    }

    public formatFilterData(rawFilters: any): FilterItem[] {
        const keys = Object.keys(rawFilters);
        const values: number[] = Object.values(rawFilters);

        return keys.map((key, index) => ({
            title: key,
            value: key,
            items: values[index],
        }));
    }
}
