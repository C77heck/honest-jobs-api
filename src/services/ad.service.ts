import { AdDocument } from '@models/ad';
import { DocumentService } from '@services/libs/document.service';

export class AdService extends DocumentService<AdDocument> {
    public getAllAds() {
        return this.collection.find();
    }
    
    public countAds(filter: any) {
        return this.collection.count(filter);
    }
}
