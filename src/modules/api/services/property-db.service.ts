import { Provider } from '../../../application/provider';
import Property from '../../crawler/models/documents/ingatlan.hu/property.document';

export interface PropertyQueryOptions {
    location?: string;
    type?: 'flat' | 'house';
    priceLessThan?: number;
    priceMoreThan?: number;
    sizeLessThan?: number;
    sizeMoreThan?: number;
}

export type MongoQuery = {};
export type MongoOptions = {};

export class PropertyDbService extends Provider {
    private document = Property;

    public async find(query: MongoQuery = {}, options: MongoOptions = {}): Promise<any> {
        //  location: 'Kecskemét'
        const document = await this.document.find(query, {}, options);

        return document;
    }
}
