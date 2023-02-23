import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import { CrawlerTypes } from '../../../tasks/task-manager';

const Schema = mongoose.Schema;

export interface PropertyGroupData {
    location: string;
    crawlerName: string;
    address: string;
    sqmPrice: number;
    size: number;
    total: number;
    href: string;
    numberOfDaysAdvertised: number;
    lastDayOn: Date;
}

export interface PropertyGroupDocument extends Document, PropertyGroupData {
    crawlerName: CrawlerTypes;
}

export interface PropertyGroupModel extends Mongoose.Model<PropertyGroupDocument> {

}

const PropertyGroup = new Schema<PropertyGroupDocument>({
    location: { type: String },
    crawlerName: { type: String },
    address: { type: String },
    sqmPrice: { type: Number },
    size: { type: Number },
    total: { type: Number },
    href: { type: String },
    numberOfDaysAdvertised: { type: Number },
    lastDayOn: { type: Date }
});

PropertyGroup.set('timestamps', true);

export default mongoose.model<PropertyGroupDocument, PropertyGroupModel>('PropertyGroup', PropertyGroup);
