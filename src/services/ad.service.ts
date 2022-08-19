import { AdDocument } from '@models/ad';
import { DocumentService } from '@services/libs/document.service';

export class AdService extends DocumentService<AdDocument> {
    public getAllAds() {
        return this.collection.find();
    }
}
