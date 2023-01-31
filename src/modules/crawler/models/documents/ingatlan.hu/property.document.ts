import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import { CrawlerTypes } from '../../../tasks/task-manager';

const Schema = mongoose.Schema;

export interface PropertyModel extends Mongoose.Model<any> {

}

export interface PropertyData {
    location: string;
    address: string;
    sqmPrice: number;
    size: number;
    total: number;
    href: string;
}

export interface PropertyDocument extends Document, PropertyData {
    crawlerName: CrawlerTypes;
}

const Property = new Schema<PropertyDocument>({
    location: { type: String },
    crawlerName: { type: String },
    address: { type: String },
    sqmPrice: { type: Number },
    size: { type: Number },
    total: { type: Number },
    href: { type: String }
});

Property.set('timestamps', true);

export default mongoose.model<PropertyDocument, PropertyModel>('Property', Property);
