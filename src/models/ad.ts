import { JobSeekerDocument } from '@models/job-seeker';
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
    meta?: string,
    company?: string;
    logo?: string;
    images?: string[];
    viewedAsRegistered?: JobSeekerDocument[];
    viewedAsGuest?: { session: string, views: number }[];
    appliedFor?: JobSeekerDocument[];
}

const adSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    expiresOn: { type: String, required: true },
    isPremium: { type: Boolean, required: true },
    viewedAsRegistered: { type: String, required: true },
    viewedAsGuest: { type: String, required: true },
    logo: String,
    meta: String,
    images: [{ type: String }],
});

adSchema.set('timestamps', true);

adSchema.plugin(uniqueValidator);

interface AdModel extends Mongoose.Model<any> {
    getAllAds(this: Mongoose.Model<any>): Promise<AdDocument[]>;

    updateAd(this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument>;

    getById(this: Mongoose.Model<any>, adId: string | number): Promise<any>;
}

adSchema.static('getAllAds', async function (this: Mongoose.Model<any>): Promise<AdDocument[]> {
    return await this.find({});
});

adSchema.static('updateAd', async function (this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument> {
    return await this.updateOne({ _id: adId }, adData);
});

adSchema.static('getById', async function (this: Mongoose.Model<any>, adId: string | number): Promise<AdDocument> {
    return await this.findById(adId);
});

export default mongoose.model<AdDocument, AdModel>('Ad', adSchema);
