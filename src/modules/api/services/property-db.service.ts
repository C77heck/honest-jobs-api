import Property, {
    PropertyData
} from '../../crawler/models/documents/ingatlan.hu/property.document';
import { Provider } from '../../crawler/providers/provider';

export interface PropertyQueryOptions {
    location?: string;
    type?: 'flat' | 'house';
    priceLessThan?: number;
    priceMoreThan?: number;
    sizeLessThan?: number;
    sizeMoreThan?: number;
}

export type MongoQuery = any;

export class PropertyDbService extends Provider {
    private document = Property;

    public async get(rawQuery: PropertyQueryOptions): Promise<any> {

        const query = this.buildQuery(rawQuery);

        return this.document.find(query);
    }


    private buildQuery(rawQuery: PropertyQueryOptions): MongoQuery {
        const query: Record<keyof PropertyData | any, any> = {};

        const keys = Object.keys(rawQuery) as Array<keyof PropertyQueryOptions>;

        for (const key of keys) {
            switch (key) {
                case 'type':
                    query.type = {};
                    continue;
                case 'location':
                    query.location = {};
                    continue;
                case 'priceLessThan':
                    query.price = {};
                    continue;
                case 'priceMoreThan':
                    query.price = {};
                    continue;
                case 'sizeLessThan':
                    query.size = {};
                    continue;
                case 'sizeMoreThan':
                    query.size = {};
                    continue;
                default:
                    continue;
            }
        }

        return query;
    }

}
