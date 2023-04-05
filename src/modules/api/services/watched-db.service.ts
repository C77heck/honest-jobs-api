import { Provider } from '../../../application/provider';
import WatchedDocument, {
    WatchDocument,
    WatchModel
} from '../../crawler/models/documents/ingatlan.hu/watched.document';

export class WatchedDbService extends Provider {
    private document = WatchedDocument;

    public async findOne(id: string): Promise<WatchModel | null> {
        const property = await this.document.find({ _id: id });

        if (!property) {
            return null;
        }

        return property as any;
    }

    public async find(query: any = {}): Promise<WatchDocument[]> {
        const properties = await this.document.find(query);

        return properties;
    }

    public async add(options: { href: string }): Promise<WatchDocument> {
        const document = new this.document(options);

        return document.save();
    }

    public async remove(id: string): Promise<any> {
        const document = await this.findOne(id);

        if (!document) {
            return;
        }

        return document.remove();
    }
}
