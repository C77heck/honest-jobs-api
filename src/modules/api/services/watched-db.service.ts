import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import {
    PropertyGroupDocument
} from '../../crawler/models/documents/ingatlan.hu/property-group.document';
import WatchedDocument, {
    WatchDocument
} from '../../crawler/models/documents/ingatlan.hu/watched.document';
import { PropertyGroupDbService } from './property-group-db.service';

export class WatchedDbService extends Provider {
    @Inject()
    public propertyGroupDbService: PropertyGroupDbService;

    private document = WatchedDocument;

    public async findOne(id: string): Promise<WatchDocument | null> {
        const property = await this.document.findById(id);

        if (!property) {
            return null;
        }

        return property;
    }

    public async find(query: any = {}): Promise<PropertyGroupDocument[]> {
        return this.document.aggregate([
            { $match: query },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'propertygroups',
                    localField: 'href',
                    foreignField: 'hrefId',
                    as: 'data'
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$data", 0] },
                            { watchlistId: '$_id' }
                        ]
                    }
                }
            }

        ]);
    }

    public async add(options: { href: string }): Promise<WatchDocument> {
        const document = new this.document(options);

        return document.save();
    }

    public async remove(id: string): Promise<any> {
        const document = await this.findOne(id);

        if (!document) {
            return;
        }

        return document.remove();
    }
}
