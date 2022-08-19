import Ad, { AdDocument } from '@models/ad';
import { PaginationInterface } from '@models/libs/pagination.interface';
import { BaseUserDocument } from '@models/user';
import Mongoose from 'mongoose';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { PaginationOptions } from '../controllers/libs/mongo-query-handlers/base-query.handler';

const Schema = mongoose.Schema;

export interface RecruiterDocument extends BaseUserDocument {
    company_name: string;
    address: string;
    postedJobs?: string[];
    relatedIndustry?: string[];
    companyType: 'Agency' | 'Direct Employer';
    logo?: string,
    addPostedJobs: (job: string) => Promise<RecruiterDocument>;
    removePostedJob: (job: string) => Promise<RecruiterDocument>;
    getPostedJobs: (pagination: PaginationOptions, filters?: {}, sort?: {}) => Promise<PaginationInterface<AdDocument>>;
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
    description: { type: String },
    address: { type: String },
    logo: { type: String },
    meta: { type: String },
    images: [{ type: String }],
});

recruiterSchema.set('timestamps', true);

recruiterSchema.plugin(uniqueValidator);

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

export interface RecruiterModel extends Mongoose.Model<any> {
    getUsers(this: Mongoose.Model<any>): Promise<RecruiterDocument[]>;

    deleteUser(this: Mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: Mongoose.Model<any>, userData: RecruiterDocument, userId: string): Promise<any>;

    getUser(this: Mongoose.Model<any>, userId: string): Promise<RecruiterDocument>;
}

recruiterSchema.static('getUsers', async function (this: Mongoose.Model<any>): Promise<RecruiterDocument[]> {
    return this.find({ isRecruiter: true });
});

recruiterSchema.static('deleteUser', async function (this: Mongoose.Model<any>, userId: string): Promise<boolean> {
    const response = await this.deleteOne({ _id: userId });

    return !!response?.acknowledged;
});

recruiterSchema.static('updateUser', async function (this: Mongoose.Model<any>, userData: RecruiterDocument, userId: string): Promise<any> {
    return this.updateOne({ _id: userId }, { ...userData });
});

recruiterSchema.static('getUser', async function (this: Mongoose.Model<any>, userId: string): Promise<RecruiterDocument> {
    return this.findOne({ _id: userId });
});

export default mongoose.model<RecruiterDocument, RecruiterModel>('Recruiter', recruiterSchema);
