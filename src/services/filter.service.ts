import Ad from '@models/ad';
import { FilterDocument } from '@models/filter';
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

        const location = [];
        const industryType = [];
        const companyType = [];
        const relatedRoles = [];
        const jobType = [];

        for (const ad of ads) {
            if (ad.location) {
                location.push(ad.location as any);

            }
            if (ad?.companyType) {
                companyType.push(ad.companyType as any);
            }
            if (ad.jobType) {
                jobType.push(ad.jobType as any);
            }
            if (ad.relatedRoles) {
                relatedRoles.push(ad.relatedRoles as any);
            }
            if (ad.industryType) {
                industryType.push(ad.industryType as any);
            }
        }

        const instance = new this.collection({
            location,
            jobType,
            industryType,
            companyType,
            relatedRoles
        });

        return instance.save();
    }
}
