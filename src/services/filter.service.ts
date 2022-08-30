import Ad from '@models/ad';
import { FilterDocument, FilterItem } from '@models/filter';
import { AdService } from '@services/ad.service';
import { DocumentService } from '@services/libs/document.service';
import moment from 'moment';
import { handleError } from '../libs/handle-error';

export class FilterService extends DocumentService<FilterDocument> {
    public adService = new AdService(Ad);

    public async getFilters(adFilters = null): Promise<FilterDocument | null> {
        const filters: any = await this.collection.findOne({});

        // TODO -> FIGURE THE MOST EFFECIENT WAY OF COUNTING DOCUMENTS ON THE FLY
        // const items = await this.adService.countAds();
        // all of them to get the items value here

        if (!adFilters) {
            return filters;
        }

        // todo -> we start to take counts of what we got.
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

        const location: { [key: string]: number } = {};
        const industryType: { [key: string]: number } = {};
        const companyType: { [key: string]: number } = {};
        const relatedRoles: { [key: string]: number } = {};
        const jobType: { [key: string]: number } = {};
        const rawPostedAt: { [key: string]: number } = {};
        const dateOptions = this.getDateOptions();

        for (const ad of ads) {
            this.groupByPostedAt(rawPostedAt, ad.createdAt, dateOptions);

            if (ad.location) {
                location[ad.location] = ad.location in location ? location[ad.location] + 1 : 1;
            }
            if (ad?.companyType) {
                companyType[ad.companyType] = ad.companyType in companyType ? companyType[ad.companyType] + 1 : 1;
            }
            if (ad.jobType) {
                jobType[ad.jobType] = ad.jobType in jobType ? jobType[ad.jobType] + 1 : 1;
            }
            if (ad.relatedRoles) {
                (ad?.relatedRoles || []).forEach(role => {
                    relatedRoles[role] = role in jobType ? jobType[role] + 1 : 1;
                });
            }
            if (ad.industryType) {
                (ad?.industryType || []).forEach(role => {
                    industryType[role] = role in jobType ? jobType[role] + 1 : 1;
                });
            }
        }

        const instance = new this.collection({
            location: this.formatFilter(location),
            jobType: this.formatFilter(jobType),
            industryType: this.formatFilter(industryType),
            companyType: this.formatFilter(companyType),
            relatedRoles: this.formatFilter(relatedRoles),
            postedAt: this.formatDateFilter(rawPostedAt)
        });

        return instance.save();
    }

    private groupByPostedAt(postedAt: any, rawCreatedAt: string | Date, dateOptions: { [key: string]: moment.Moment }) {
        const createdAt = moment(rawCreatedAt);

        if (dateOptions['336'].isAfter(createdAt)) {
            postedAt['336'] = postedAt['336'] ? postedAt['336'] + 1 : 1;
        } else if (dateOptions['168'].isAfter(createdAt)) {
            postedAt['168'] = postedAt['168'] ? postedAt['168'] + 1 : 1;
        } else if (dateOptions['72'].isAfter(createdAt)) {
            postedAt['72'] = postedAt['72'] ? postedAt['72'] + 1 : 1;
        } else if (dateOptions['24'].isAfter(createdAt)) {
            postedAt['24'] = postedAt['24'] ? postedAt['24'] + 1 : 1;
        }
    }

    private getDateOptions() {
        return {
            '24': moment().add(1, 'day'),
            '72': moment().add(3, 'day'),
            '168': moment().add(1, 'week'),
            '336': moment().add(2, 'week'),
        };
    }

    private formatFilter(rawFilters: { [key: string]: number }): FilterItem[] {
        const filter: FilterItem[] = [];
        for (const prop in rawFilters) {
            filter.push({ title: prop, value: prop, items: rawFilters[prop] });
        }

        return filter;
    }

    private formatDateFilter(rawFilters: { [key: string]: number }): FilterItem[] {
        const filter: FilterItem[] = [];

        for (const prop in rawFilters) {
            console.log(rawFilters, rawFilters[prop]);
            switch (prop) {
                case '24':
                    filter.push({ title: 'Last 24 hours', value: prop, items: rawFilters[prop] });
                    break;
                case '72':
                    filter.push({ title: 'Last 3 days', value: prop, items: rawFilters[prop] });
                    break;
                case '168':
                    filter.push({ title: 'Last 7 days', value: prop, items: rawFilters[prop] });
                    break;
                case '336':
                    filter.push({ title: 'Last 14 days', value: prop, items: rawFilters[prop] });
                    break;
                default:
                    break;
            }
        }

        return filter;
    }
}
