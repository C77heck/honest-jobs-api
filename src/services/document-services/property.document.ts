import PropertyScema, { PropertyModel } from '@models/documents/ingatlan.hu/property.document';
import { Inject } from '../../application/libs/inject.decorator';
import { Provider } from '../../providers/provider';
import HookService from '../hook.service';
import { RawData } from '../interfaces/processed-data.interface';

export interface DatabaseInterface {

}

export class PropertyDocument extends Provider implements DatabaseInterface {
    @Inject()
    public hookService: HookService;

    public document: PropertyModel;

    public boot() {
        this.document = PropertyScema;

        this.hookService.$rawData.subscribe((data: RawData) => this.saveData(data));
    }

    private async saveData(data: RawData) {
        try {
            for (const property of data.data) {
                const document = new this.document({
                    ...property,
                    crawlerName: data.crawlerName
                });

                await document.save();
            }
        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
    }
}
