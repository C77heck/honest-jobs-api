import Ad from '@models/ad';
import { FilterDocument, FilterItem } from '@models/filter';
import { AdService } from '@services/ad.service';
import { DocumentService } from '@services/libs/document.service';
import { handleError } from '../libs/handle-error';

export class FilterService extends DocumentService<FilterDocument> {
    public adService = new AdService(Ad);

    public async getFilters(): Promise<FilterDocument | null> {
        const filters = await this.collection.findOne({});

        return filters;
    }

    public async remove() {
        try {
            const filter = await this.getFilters();

            if (!filter) {
                return null;
            }

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
            industryType: {},
            companyType: {},
            postedAt: {},
            relatedRoles: {},
            jobType: {}
        };

        for (const ad of ads) {
            const location = filters.location as any;
            location[ad.location] = location[ad.location] ? location[ad.location] + 1 : 1;

            const companyType = filters.companyType as any;
            companyType[ad.companyType] = companyType[ad.companyType] ? companyType[ad.companyType] + 1 : 1;

            const postedAt = filters.postedAt as any;
            const key = ad.createdAt.toString();
            postedAt[key] = postedAt[key] ? postedAt[key] + 1 : 1;

            const jobType = filters.jobType as any;
            jobType[ad.jobType] = jobType[ad.jobType] ? jobType[ad.jobType] + 1 : 1;

            const relatedRoles = filters.relatedRoles as any;
            (ad.relatedRoles || []).map(role => {
                relatedRoles[role] = relatedRoles[role] ? relatedRoles[role] + 1 : 1;
            });

            const industryType = filters.relatedRoles as any;
            (ad.industryType || []).map(type => {
                industryType[type] = relatedRoles[type] ? relatedRoles[type] + 1 : 1;
            });
        }

        return this.collection.create({
            location: this.formatFilterData(filters.location),
            jobType: this.formatFilterData(filters.jobType),
            industryType: this.formatFilterData(filters.industryType),
            companyType: this.formatFilterData(filters.companyType),
            postedAt: this.formatFilterData(filters.postedAt),
            relatedRoles: this.formatFilterData(filters.relatedRoles) // TODO -> FIGURE HOW TO connect names
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
