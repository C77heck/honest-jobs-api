import { Inject } from '../../application/libs/inject.decorator';
import PropertySchema, {
    PropertyModel
} from '../../models/documents/ingatlan.hu/property.document';
import { Provider } from '../../providers/provider';
import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';

export interface DatabaseInterface {

}

export class PropertyDocument extends Provider implements DatabaseInterface {
    @Inject()
    private hookService: HookService;

    private document: PropertyModel;

    public boot() {
        this.document = PropertySchema;
    }

    public async saveData(data: RawData) {
        try {
            await this.document.insertMany(data.data.map(property => ({
                ...data.data,
                crawlerName: data.crawlerName
            })));
        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
        // for (const property of data.data) {
        //     const document = new this.document({
        //         ...property,
        //         crawlerName: data.crawlerName
        //     });
        //
        //     await document.save();
        // }
    }
}
