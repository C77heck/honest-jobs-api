import { Provider } from '../../../application/provider';
import PropertyGroupDocument, {
    PropertyGroupData
} from '../../crawler/models/documents/ingatlan.hu/property-group.document';
import { MongoOptions, MongoQuery } from './property-db.service';

export class PropertyGroupDbService extends Provider {
    private document = PropertyGroupDocument;

    public async find(query: MongoQuery = {}, options: MongoOptions = {}): Promise<PropertyGroupData[]> {
        const properties = await this.document.find(query, {}, options);

        return properties;
    }

    public async paginate(query: MongoQuery = {}, options: MongoOptions = {}): Promise<{ data: PropertyGroupData[]; total: number }> {
        const data = await this.document.find(query, {}, options);
        const total = await this.document.count(query);

        return { data, total };
    }

    public async create(data: PropertyGroupData) {
        await this.document.create(data);
    }

    public async clearDB() {
        await this.document.deleteMany({});
    }
}
