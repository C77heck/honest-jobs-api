import Mongoose, { Document } from 'mongoose';
export declare class DocumentService<T extends Document> {
    collection: Mongoose.Model<T, {}>;
    constructor(collection: Mongoose.Model<T, {}>);
}
