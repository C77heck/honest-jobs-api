import { Inject } from '../../../application/libs/inject.decorator';
import Property, { PropertyModel } from '../../models/documents/ingatlan.hu/property.document';
import { Provider } from '../../providers/provider';
import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';

export interface DocumentInterface {
    saveData: (data: RawData) => Promise<void>;
}

export class PropertyDocument extends Provider implements DocumentInterface {
    @Inject()
    private hookService: HookService;

    private document: PropertyModel;

    public boot() {
        this.document = Property;
    }

    public async saveData(data: RawData) {
        try {
            await this.document.insertMany(data.data.map(property => ({
                location: property.location,
                address: property.address,
                sqmPrice: property.sqmPrice,
                size: property.size,
                total: property.total,
                href: property.href,
                crawlerName: data.crawlerName
            })));
        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
    }
}
