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
    analytics: {
        viewed: number;
        appliedFor: number;
        standard: boolean;
        featured: boolean;
        premium: boolean;
    }
}

const adSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    expiresOn: { type: String, required: true },
    isPremium: { type: Boolean, required: true },
    viewedAsRegistered: { type: String },
    viewedAsGuest: { type: String },
    logo: String,
    meta: String,
    images: [{ type: String }],
    analytics: {
        viewed: { type: Number, default: 0 },
        appliedFor: { type: Number, default: 0 },
        standard: { type: Boolean, default: false },
        featured: { type: Boolean, default: false },
        premium: { type: Boolean, default: false }
    },
});

adSchema.set('timestamps', true);

adSchema.plugin(uniqueValidator);

interface AdModel extends Mongoose.Model<any> {
    getAllAds(this: Mongoose.Model<any>): Promise<AdDocument[]>;

    updateAd(this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument>;

    getById(this: Mongoose.Model<any>, adId: string | number): Promise<any>;

    addView(this: Mongoose.Model<any>, adId: string | number): Promise<any>;

    addAppliedFor(this: Mongoose.Model<any>, adId: string | number): Promise<any>;

    switchAdCategory(this: Mongoose.Model<any>, adId: string | number): Promise<any>;
}

adSchema.static('getAllAds', async function (this: Mongoose.Model<AdDocument>): Promise<AdDocument[]> {
    return this.find({});
});

adSchema.static('updateAd', async function (this: Mongoose.Model<AdDocument>, adId: string | number, adData: AdDocument): Promise<AdDocument> {
    return this.updateOne({ _id: adId }, adData);
});

adSchema.static('getById', async function (this: Mongoose.Model<AdDocument>, adId: string | number): Promise<AdDocument | null> {
    return this.findById(adId);
});

adSchema.static('addView', async function (this: Mongoose.Model<AdDocument>, adId: string | number): Promise<AdDocument | void> {
    const ad = await this.findById(adId);

    if (!ad) {
        return;
    }

    ad.analytics.viewed += 1;

    return ad.save();
});

adSchema.static('addAppliedFor', async function (this: Mongoose.Model<AdDocument>, adId: string | number): Promise<AdDocument | void> {
    const ad = await this.findById(adId);

    if (!ad) {
        return;
    }

    ad.analytics.appliedFor += 1;

    return ad.save();
});

adSchema.static('switchAdCategory', async function (this: Mongoose.Model<AdDocument>, adId: string | number, category: 'standard' | 'featured' | 'premium'): Promise<AdDocument | void> {
    const ad = await this.findById(adId);

    if (!ad) {
        return;
    }

    ad.analytics.featured = false;
    ad.analytics.standard = false;
    ad.analytics.premium = false;

    switch (category) {
        case 'featured':
            ad.analytics.featured = true;
            break;
        case 'premium':
            ad.analytics.premium = false;
            break;
        case 'standard':
            ad.analytics.standard = false;
            break;
        default:
            break;
    }

    return ad.save();
});

export default mongoose.model<AdDocument, AdModel>('Ad', adSchema);
