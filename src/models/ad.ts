import { PaginationInterface } from '@models/libs/pagination.interface';
import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { PaginationOptions } from '../controllers/libs/query';

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
    appliedFor?: { jobSeeker: string, views: Date[] }[];
    analytics: {
        viewedAsRegistered?: { userId: string, views: Date[] }[];
        viewedAsGuest?: { sessionId: string, views: Date[] }[];
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
    logo: String,
    meta: String,
    images: [{ type: String }],
    analytics: {
        viewedAsRegistered: [{
            userId: { type: [mongoose.Types.ObjectId], ref: 'JobSeeker' },
            views: [Date]
        }],
        viewedAsGuest: [{
            sessionId: String,
            views: [Date]
        }], appliedFor: { type: Number, default: 0 },
        standard: { type: Boolean, default: false },
        featured: { type: Boolean, default: false },
        premium: { type: Boolean, default: false }
    },
});

adSchema.set('timestamps', true);

adSchema.plugin(uniqueValidator);

interface AdModel extends Mongoose.Model<any> {
    getAllAds(pagination: PaginationOptions, filters?: {}, sort?: {}): Promise<PaginationInterface<AdDocument>>;

    updateAd(this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument>;

    getById(this: Mongoose.Model<any>, adId: string | number): Promise<any>;

    addGuestView(this: Mongoose.Model<any>, sessionId: string, adId: string | number): Promise<any>;

    addRegisteredUserView(this: Mongoose.Model<any>, userId: string, adId: string | number): Promise<any>;

    addAppliedFor(this: Mongoose.Model<any>, adId: string | number): Promise<any>;

    switchAdCategory(this: Mongoose.Model<any>, adId: string | number): Promise<any>;
}

adSchema.static('getAllAds', async function (this: Mongoose.Model<AdDocument>, pagination: PaginationOptions, filters = {}, sort = {}): Promise<PaginationInterface<AdDocument>> {
    const limit = pagination?.limit || 5;
    const page = pagination?.page || 0;

    const items = await this.find({
        ...filters,
    })
        .limit(limit)
        .skip(page * limit)
        .sort(sort);

    const all = await this.find({
        ...filters,
    }).count();

    return {
        items,
        limit: limit,
        total: Math.ceil(all / limit),
        totalItems: all,
        page: page
    };
});

adSchema.static('updateAd', async function (this: Mongoose.Model<AdDocument>, adId: string | number, adData: AdDocument): Promise<AdDocument> {
    return this.updateOne({ _id: adId }, adData);
});

adSchema.static('getById', async function (this: Mongoose.Model<AdDocument>, adId: string | number): Promise<AdDocument | null> {
    return this.findById(adId);
});

adSchema.static('addGuestView', async function (this: Mongoose.Model<AdDocument>, sessionId: string, adId: string | number): Promise<AdDocument | void> {
    const ad = await this.findById(adId);

    if (!ad) {
        return;
    }

    const view = (ad.analytics?.viewedAsGuest || []).find(view => view.sessionId === sessionId);

    if (!view) {
        ad.analytics.viewedAsGuest = [{ sessionId, views: [new Date()] }];
    } else {
        view.views.push(new Date());
    }

    return ad.save();
});

adSchema.static('addRegisteredUserView', async function (this: Mongoose.Model<AdDocument>, userId: string, adId: string | number): Promise<AdDocument | void> {
    const ad = await this.findById(adId);

    if (!ad) {
        return;
    }

    const view = (ad.analytics?.viewedAsRegistered || []).find(view => view.userId === userId);

    if (!view) {
        ad.analytics.viewedAsRegistered = [{ userId, views: [new Date()] }];
    } else {
        view.views.push(new Date());
    }

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
