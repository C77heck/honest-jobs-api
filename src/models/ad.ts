import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface AdDocument extends Document {
    title: string;
    description: string;
    salary: string;
    location: string;
    expiresOn: Date;
    isPremium: boolean;
    meta?: string[],
    images?: string[];
}

const adSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    expiresOn: { type: String, required: true },
    isPremium: { type: String, required: true },
    meta: [{ type: String }],
    images: [{ type: String }],
});

adSchema.set('timestamps', true);

adSchema.plugin(uniqueValidator);

interface AdModel extends Mongoose.Model<any> {
    getAllAds(this: Mongoose.Model<any>): Promise<AdDocument[]>;

    getAdsByEmployer(this: Mongoose.Model<any>, userId: string): Promise<AdDocument[]>;

    updateAd(this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument>;

    getById(this: Mongoose.Model<any>, adId: string | number): Promise<any>;
}

adSchema.static('getAllAds', async function (this: Mongoose.Model<any>): Promise<AdDocument[]> {
    return await this.find({});
});

adSchema.static('getAdsByEmployer', async function (this: Mongoose.Model<any>, userId: string): Promise<AdDocument[]> {
    return await this.find({});
});

adSchema.static('updateAd', async function (this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument> {
    return await this.updateOne({ _id: adId }, adData);
});

adSchema.static('getById', async function (this: Mongoose.Model<any>, adId: string | number): Promise<AdDocument> {
    return await this.findOne({ _id: adId });
});

export default mongoose.model<AdDocument, AdModel>('Ad', adSchema);
