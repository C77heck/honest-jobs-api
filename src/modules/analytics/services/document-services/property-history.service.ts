import { Inject } from '../../../../application/libs/inject.decorator';
import { Provider } from '../../../../application/provider';
import HookService from '../../../crawler/services/hook.service';
import PropertyHistory, {
    PropertyHistoryModel
} from '../../models/documents/ingatlan.hu/property-history.document';

export interface DocumentInterface {
    saveHistory: (groups: any[]) => Promise<void>;
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

    public async saveHistory(groups: any[]) {
        try {
            await this.document.insertMany(groups);
        } catch (e) {
            this.hookService.$errorLog.next({
                type: 'MongodbError',
                payload: e,
            });
        }
    }
}
