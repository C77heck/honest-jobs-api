import { PaginationInterface } from '@models/libs/pagination.interface';
import { RoleDocument } from '@models/role';
import { BaseUserDocument, RoleType } from '@models/user';
import { PaginationOptions } from '@services/libs/mongo-query.service';
import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// TODO
// companyType = need to be implemented
// postedAt needs just the range to  be implemented perhaps we wont need this.
// related roles need categories to be implemented on both the front and the backend
// job types liek full-time part-time ...etc

export interface AdDocument extends Document {
    title: string;
    description: string;
    salary: number;
    location: string;
    expiresOn: Date;
    isPremium: boolean;

    jobType: 'Permanent' | 'Remote' | 'Contract' | 'Part Time' | 'Temporary';
    companyType: 'Agency' | 'Direct Employer';
    industryType?: string[];
    relatedRoles?: string[];
    createdAt: Date;
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
    jobSeekerAlerts: { id: string, addedAt: Date }[];
    recruiterAlerts: { id: string, addedAt: Date }[];
    addUserToAlerts: (user: BaseUserDocument, role: RoleDocument) => Promise<AdDocument>
    removeUserFromAlerts: (user: BaseUserDocument, role: RoleDocument) => Promise<AdDocument>
}

const adSchema = new Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    salary: { type: Number, required: true, index: true },
    location: { type: String, required: true, index: true },
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
        relatedRoles: { type: [String] },
        standard: { type: Boolean, default: false },
        featured: { type: Boolean, default: false },
        premium: { type: Boolean, default: false }
    },
    jobSeekerAlerts: [{ id: { type: mongoose.Types.ObjectId, ref: 'JobSeeker' }, addedAt: Date }],
    recruiterAlerts: [{ id: { type: mongoose.Types.ObjectId, ref: 'Recruiter' }, addedAt: Date }],
});

adSchema.set('timestamps', true);

adSchema.plugin(uniqueValidator);

adSchema.methods.getIsUserInAlertList = function (user: BaseUserDocument, role: RoleType) {
    const alerts = role === 'recruiter' ? this.recruiterAlerts : this.jobSeekerAlerts;

    return !!alerts.find((alert: any) => alert.id.toString() === user?._id.toString());
};
adSchema.methods.addUserToAlerts = function (user: BaseUserDocument, role: RoleType) {
    let alerts = role === 'recruiter' ? this.recruiterAlerts : this.jobSeekerAlerts;

    alerts = [...alerts, { id: user._id, addedAt: new Date() }];

    return this.save({ validateModifiedOnly: true });
};

adSchema.methods.removeUserFromAlerts = function (user: BaseUserDocument, role: RoleType) {
    let alerts = role === 'recruiter' ? this.recruiterAlerts : this.jobSeekerAlerts;

    alerts = alerts.filter((alert: any) => alert.id.toString() !== user._id.toString());

    return this.save({ validateModifiedOnly: true });
};

interface AdModel extends Mongoose.Model<any> {
    getAllAds(pagination: any, filters?: {}, sort?: {}): Promise<PaginationInterface<AdDocument>>;

    updateAd(this: Mongoose.Model<any>, adId: string | number, adData: AdDocument): Promise<AdDocument>;

    getById(this: Mongoose.Model<any>, adId: string | number): Promise<AdDocument>;

    addGuestView(this: Mongoose.Model<any>, sessionId: string, adId: string | number): Promise<AdDocument>;

    addRegisteredUserView(this: Mongoose.Model<any>, userId: string, adId: string | number): Promise<AdDocument>;

    addAppliedFor(this: Mongoose.Model<any>, adId: string | number): Promise<AdDocument>;

    switchAdCategory(this: Mongoose.Model<any>, adId: string | number): Promise<AdDocument>;
}

adSchema.static('getAllAds', async function (this: Mongoose.Model<AdDocument>, pagination: PaginationOptions, filters = {}, sort = {}): Promise<PaginationInterface<AdDocument>> {
    const limit = pagination?.limit || 5;
    const page = pagination?.page || 0;
    console.log(filters);
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

    return ad.save({ validateModifiedOnly: true });
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
