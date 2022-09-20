import Ad, { AdDocument } from '@models/ad';
import { BadRequest } from '@models/libs/error-models/errors';
import { DocumentService } from '@services/libs/document.service';
import { ERROR_MESSAGES } from '../libs/constants';

export class AdService extends DocumentService<AdDocument> {
    public getAllAds() {
        return this.collection.find();
    }

    public countAds(filter: any) {
        return this.collection.count(filter);
    }

    public async getAd(adId?: string) {
        if (!adId) {
            throw new BadRequest(ERROR_MESSAGES.MISSING.AD);
        }

        const ad = await Ad.findById(adId);

        if (!ad) {
            throw new BadRequest(ERROR_MESSAGES.NOT_FOUND.AD);
        }

        return ad;
    }
}
