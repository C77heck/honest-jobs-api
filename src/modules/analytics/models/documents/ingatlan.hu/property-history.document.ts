import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface PropertyData {
    propertyId: string;
    propertyDocument: { id: { type: mongoose.Types.ObjectId, ref: any } }[];
}

export interface PropertyHistoryDocument extends Document, PropertyData {
}

export interface PropertyHistoryModel extends Mongoose.Model<PropertyHistoryDocument> {

}

const PropertyHistory = new Schema<PropertyHistoryDocument>({
    propertyId: { type: String },
    propertyDocument: [{ id: { type: mongoose.Types.ObjectId, ref: 'Property' } }],
});

PropertyHistory.set('timestamps', true);

export default mongoose.model<PropertyHistoryDocument, PropertyHistoryModel>('PropertyHistory', PropertyHistory);
