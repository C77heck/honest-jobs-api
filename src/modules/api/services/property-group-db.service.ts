import { Provider } from '../../../application/provider';
import PropertyGroupDocument, {
    PropertyGroupData
} from '../../crawler/models/documents/ingatlan.hu/property-group.document';
import { PropertyDocument } from '../../crawler/models/documents/ingatlan.hu/property.document';
import { MongoOptions, MongoQuery } from './property-db.service';

export class PropertyGroupDbService extends Provider {
    private document = PropertyGroupDocument;

    public async find(query: MongoQuery = {}, options: MongoOptions = {}): Promise<PropertyDocument[]> {
        const properties = await this.document.find(query, {}, options);

        return properties;
    }

    public async paginate(query: MongoQuery = {}, options: MongoOptions = {}): Promise<{ properties: PropertyDocument[]; total: number }> {
        const properties = await this.document.find(query, {}, options);
        const total = await this.document.count(query);

        return { properties, total };
    }

    public async create(data: PropertyGroupData) {
        await this.document.create(data);
    }

    public async clearDB() {
        await this.document.deleteMany({});
    }
}
