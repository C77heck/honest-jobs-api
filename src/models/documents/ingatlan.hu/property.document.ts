import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import { CrawlerTypes } from '../../../tasks/task-manager';

const Schema = mongoose.Schema;

export interface PropertyModel extends Mongoose.Model<any> {

}

export interface Property {
    address: string;
    sqmPrice: number;
    total: number;
    href: string;
}

export interface PropertyDocument extends Document, Property {
    crawlerName: CrawlerTypes;
}

const PropertySchema = new Schema<PropertyDocument>({
    crawlerName: { type: String },
    sqmPrice: { type: Number },
    total: { type: Number },
    href: { type: String }
});

PropertySchema.set('timestamps', true);

export default mongoose.model<PropertyDocument, PropertyModel>('Property', PropertySchema);
