import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import Property, { PropertyModel } from '../../models/documents/ingatlan.hu/property.document';
import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';

export interface DocumentInterface {
    saveData: (data: RawData) => Promise<void>;
}

export class PropertyService extends Provider implements DocumentInterface {
    @Inject()
    private hookService: HookService;

    private document: PropertyModel;

    public boot() {
        this.document = Property;
    }

    public async saveData(data: RawData) {
        try {
            const properties = data.data.map(property => ({
                location: data.location,
                address: property.address,
                sqmPrice: property.sqmPrice,
                size: property.size,
                total: property.total,
                href: property.href,
                crawlerName: data.crawlerName
            }));

            await this.document.insertMany(properties);
        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
    }
}
