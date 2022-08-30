import Ad from '@models/ad';
import { FilterDocument, FilterItem } from '@models/filter';
import { AdService } from '@services/ad.service';
import { DocumentService } from '@services/libs/document.service';
import { handleError } from '../libs/handle-error';
import { removeDuplicates } from '../libs/helpers';

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

        const location: string[] = [];
        const industryType: string[] = [];
        const companyType: string[] = [];
        const relatedRoles: string[] = [];
        const jobType: string[] = [];

        for (const ad of ads) {
            if (ad.location) {
                location.push(ad.location);
            }
            if (ad?.companyType) {
                companyType.push(ad.companyType);
            }
            if (ad.jobType) {
                jobType.push(ad.jobType);
            }
            if (ad.relatedRoles) {
                relatedRoles.push(...(ad?.relatedRoles || []));
            }
            if (ad.industryType) {
                industryType.push(...(ad?.industryType || []));
            }
        }

        const instance = new this.collection({
            location: this.formatFilter(location),
            jobType: this.formatFilter(jobType),
            industryType: this.formatFilter(industryType),
            companyType: this.formatFilter(companyType),
            relatedRoles: this.formatFilter(relatedRoles)
        });

        return instance.save();
    }

    private formatFilter(rawFilters: string[]): FilterItem[] {
        return removeDuplicates(rawFilters).map(filter => ({ title: filter, value: filter }));
    }
}
