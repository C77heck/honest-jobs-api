import Mongoose, { Document } from 'mongoose';

export class DocumentService<T extends Document> {
    public collection: Mongoose.Model<T, {}>;

    public constructor(collection: Mongoose.Model<T, {}>) {
        this.collection = collection;
    }
}
