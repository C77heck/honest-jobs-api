import Ad, { AdDocument } from '@models/ad';
import { PaginationInterface } from '@models/libs/pagination.interface';
import { BaseUserDocument } from '@models/user';
import { PaginationOptions } from '@services/libs/mongo-query.service';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface RecruiterDocument extends BaseUserDocument {
    company_name: string;
    address: string;
    postedJobs?: string[];
    relatedIndustry?: string[];
    companyType: 'Agency' | 'Direct Employer';
    logo?: string;
    favourites?: { id: string, addedAt: Date }[];
    addPostedJobs: (job: string) => Promise<RecruiterDocument>;
    removePostedJob: (job: string) => Promise<RecruiterDocument>;
    getPostedJobs: (pagination: PaginationOptions, filters?: {}, sort?: {}) => Promise<PaginationInterface<AdDocument>>;
    addToFavourites: (adId: string) => Promise<RecruiterDocument>;
    removeFromFavourites: (adId: string) => Promise<RecruiterDocument>;
}

const recruiterSchema = new Schema<RecruiterDocument>({
    company_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    companyType: { type: String, required: true },
    relatedIndustry: { type: [String], required: true },
    status: {
        loginAttempts: { type: Number, required: false, default: 0 },
        isBlocked: { type: Boolean, required: false, default: false }
    },
    isRecruiter: { type: Boolean, required: true, default: false },
    postedJobs: { type: [mongoose.Types.ObjectId], ref: 'Ad' },
    favourites: [{ id: { type: mongoose.Types.ObjectId, ref: 'Ad' }, addedAt: Date }],
    description: { type: String },
    address: { type: String },
    logo: { type: String },
    meta: { type: String },
    images: [{ type: String }],
});

recruiterSchema.methods.getPublicData = function () {
    return {
        id: this._id,
        role: 'recruiter',
        email: this.email,
        description: this?.description || '',
        address: this?.address || '',
        meta: this?.meta || '',
        images: this?.images || [''],
        company_name: this?.company_name || '',
        logo: this?.logo || '',
        favourites: this?.favourites || [],
    };
};

recruiterSchema.set('timestamps', true);

recruiterSchema.methods.addToFavourites = function (adId: string) {
    if ((this.favourites || []).find(doc => doc.id.toString() === adId)) {
        return this.save({ validateModifiedOnly: true });
    }

    this.favourites = [...(this.favourites || []), { id: adId, addedAt: new Date() }];

    return this.save({ validateModifiedOnly: true });
};

recruiterSchema.methods.removeFromFavourites = function (adId: string) {
    this.favourites = (this.favourites || []).filter(favourite => favourite.id.toString() !== adId);

    return this.save({ validateModifiedOnly: true });
};

recruiterSchema.methods.addPostedJobs = function (job: string): Promise<RecruiterDocument> {
    this.postedJobs = [...(this.postedJobs || []), job];

    return this.save({ validateModifiedOnly: true });
};

recruiterSchema.methods.removePostedJob = function (job: string): Promise<RecruiterDocument> {
    this.postedJobs = (this.postedJobs || []).filter((postedJob: any) => postedJob.toString() !== job);

    return this.save({ validateModifiedOnly: true });
};

recruiterSchema.methods.getPostedJobs = async function (pagination: PaginationOptions, filters = {}, sort = {}): Promise<PaginationInterface<AdDocument>> {
    const limit = pagination?.limit || 5;
    const page = pagination?.page || 0;

    const items = await Ad.find({
        ...filters,
        _id: { $in: this.postedJobs }
    })
        .limit(limit)
        .skip(page * limit)
        .sort(sort);

    const all = await Ad.find({
        ...filters,
        _id: { $in: this.postedJobs }
    }).count();

    return {
        items,
        limit: limit,
        total: Math.ceil(all / limit),
        totalItems: all,
        page: page
    };
};

recruiterSchema.methods.loginAttempts = async function (loginAttempts: number): Promise<RecruiterDocument> {
    this.status.loginAttempts = loginAttempts;

    return this.save({ validateModifiedOnly: true });
};

recruiterSchema.methods.getUserSecurityQuestion = async function (): Promise<string> {
    return this.securityQuestion;
};

export interface RecruiterModel extends mongoose.Model<any> {
    getUsers(this: mongoose.Model<any>): Promise<RecruiterDocument[]>;

    deleteUser(this: mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: mongoose.Model<any>, userData: RecruiterDocument, userId: string): Promise<any>;

    getUser(this: mongoose.Model<any>, userId: string): Promise<RecruiterDocument>;
}

recruiterSchema.static('getUsers', async function (this: mongoose.Model<any>): Promise<RecruiterDocument[]> {
    return this.find({ isRecruiter: true });
});

recruiterSchema.static('deleteUser', async function (this: mongoose.Model<any>, userId: string): Promise<boolean> {
    const response = await this.deleteOne({ _id: userId });

    return !!response?.acknowledged;
});

recruiterSchema.static('updateUser', async function (this: mongoose.Model<any>, userData: RecruiterDocument, userId: string): Promise<any> {
    return this.updateOne({ _id: userId }, { ...userData });
});

recruiterSchema.static('getUser', async function (this: mongoose.Model<any>, userId: string): Promise<RecruiterDocument> {
    return this.findOne({ _id: userId });
});

export default mongoose.model<RecruiterDocument, RecruiterModel>('Recruiter', recruiterSchema);
