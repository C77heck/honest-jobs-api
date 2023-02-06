import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import HookService from '../../../crawler/services/hook.service';
import PropertyHistory, {
    PropertyHistoryModel
} from '../../models/documents/ingatlan.hu/property-history.document';

export interface DocumentInterface {
    saveHistory: (propertyDocId: string) => Promise<void>;
}

export class PropertyHistoryService extends Provider implements DocumentInterface {
    private document: PropertyHistoryModel;

    @Inject()
    public hookService: HookService;

    public boot() {
        this.document = PropertyHistory;
    }

    public async getAll() {
        return this.document.find({});
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
