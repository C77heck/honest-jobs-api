import { Provider } from '../../../application/provider';
import PropertyGroupDocument, {
    PropertyGroupData
} from '../../crawler/models/documents/ingatlan.hu/property-group.document';
import { MongoOptions, MongoQuery, PaginationOptions } from './property-db.service';

export class PropertyGroupDbService extends Provider {
    private document = PropertyGroupDocument;

    public async find(query: MongoQuery = {}, options: MongoOptions = {}): Promise<PropertyGroupData[]> {
        const properties = await this.document.find(query, {}, options);

        return properties;
    }

    public async paginate(query: MongoQuery = {}, options: PaginationOptions): Promise<{ data: PropertyGroupData[]; total: number }> {
        const sort = options?.sort || { createdAt: -1 };

        const [result] = await this.document.aggregate([
            {
                $facet: {
                    count: [
                        { $match: query },
                        { $group: { _id: '$href' } },
                        { $count: 'total' }
                    ],
                    docs: [
                        { $match: query },
                        { $sort: sort },
                        { $skip: options.skip },
                        { $limit: options.limit },
                        {
                            $lookup: {
                                from: 'watch',
                                localField: 'href',
                                foreignField: 'href',
                                as: 'isWatched'
                            }
                        },
                        {
                            $addFields: {
                                isWatched: {
                                    $cond: {
                                        if: { $gt: [{ $size: '$isWatched' }, 0] },
                                        then: true,
                                        else: false,
                                    },
                                },
                            },
                        },
                    ],
                }
            },
        ]);

        return {
            data: result.docs,
            total: Math.ceil((result.count?.[0]?.total || 1) / options.limit)
        };
    }

    public async create(data: PropertyGroupData) {
        await this.document.create(data);
    }

    public async clearDB() {
        await this.document.deleteMany({});
    }
}
