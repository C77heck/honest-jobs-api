import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import { CrawlerTypes } from '../../../tasks/task-manager';

const Schema = mongoose.Schema;

export interface PropertyData {
    location: string;
    crawlerName: string;
    address: string;
    sqmPrice: number;
    size: number;
    total: number;
    href: string;
}

export interface PropertyDocument extends Document, PropertyData {
    crawlerName: CrawlerTypes;
}

export interface PropertyModel extends Mongoose.Model<PropertyDocument> {

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
