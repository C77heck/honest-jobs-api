import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import HookService from '../../../crawler/services/hook.service';
import PropertyHistory, { PropertyHistoryModel } from '../../models/documents/ingatlan.hu/property-history.document';

export interface DocumentInterface {
    saveHistory: (propertyDocId: string) => Promise<void>;
}

export class PropertyHistoryService extends Provider implements DocumentInterface {
    @Inject()
    private hookService: HookService;

    private document: PropertyHistoryModel;

    public boot() {
        this.document = PropertyHistory;
    }

    public async saveHistory(propertyDocId: string) {
        try {

        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
    }
}
