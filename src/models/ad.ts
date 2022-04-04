import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface AdModel extends Document {
    title: string;
    description: string;
    salary: string;
    location: string;
    expiresOn: Date;
    isPremium: boolean;
}

const adSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    expiresOn: { type: String, required: true },
    isPremium: { type: String, required: true },
    timestamps: { type: Boolean, default: true },
});

adSchema.set('timestamps', true);

adSchema.plugin(uniqueValidator);

export default mongoose.model<AdModel>('Ad', adSchema);
