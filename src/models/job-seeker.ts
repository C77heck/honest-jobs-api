import Ad, { AdDocument } from '@models/ad';
import { PaginationInterface } from '@models/libs/pagination.interface';
import { BaseUserDocument } from '@models/user';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface JobSeekerDocument extends BaseUserDocument {
    first_name: string;
    last_name: string;
    images?: string[];
    cv: string;
    profileShare: boolean;
    educationLevel?: string;
    currentJobTitle?: string;
    currentSalary?: number;
    appliedForJobs?: { id: string, appliedAt: Date }[];
    viewedAd?: { id: string, viewedAt: Date }[];
    desiredRoles: string[];
    favourites: { id: string, addedAt: Date }[];
    addAppliedJobs: (job: string) => Promise<JobSeekerDocument>;
    removeAppliedJob: (job: string) => Promise<JobSeekerDocument>;
    getAppliedJobs: () => Promise<AdDocument[]>;
    addView: (adId: string) => Promise<JobSeekerDocument>;
    addToFavourites: (adId: string) => Promise<JobSeekerDocument>;
    removeFromFavourites: (adId: string) => Promise<JobSeekerDocument>;
    getFavourites: (pagination: any, filters?: {}, sort?: {}) => Promise<PaginationInterface<AdDocument>>;
}

const jobSeekerSchema = new Schema<JobSeekerDocument>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    status: {
        loginAttempts: { type: Number, required: false, default: 0 },
        isBlocked: { type: Boolean, required: false, default: false }
    },
    isRecruiter: { type: Boolean, required: true, default: false },
    favourites: [{ id: { type: mongoose.Types.ObjectId, ref: 'Ad' }, addedAt: Date }],
    appliedForJobs: { type: [{ id: mongoose.Types.ObjectId, appliedAt: Date }], ref: 'Ad' },
    viewedAd: { type: [{ id: mongoose.Types.ObjectId, viewedAt: Date }], ref: 'Ad' },
    desiredRoles: { type: [mongoose.Types.ObjectId], ref: 'Roles' },
    description: { type: String },
    logo: { type: String },
    meta: { type: String },
    cv: { type: String, required: true },
    profileShare: { type: Boolean },
    educationLevel: { type: String },
    currentJobTitle: { type: String },
    currentSalary: { type: Number },
});

jobSeekerSchema.set('timestamps', true);

// todo check how to validate schema.
jobSeekerSchema.plugin((schema: mongoose.Schema) => console.log(schema));

jobSeekerSchema.methods.addAppliedJobs = function (job: string) {
    this.appliedForJobs = [...(this.appliedForJobs || []), { id: job, appliedAt: new Date() }];

    return this.save();
};

jobSeekerSchema.methods.addToFavourites = function (adId: string) {
    if ((this.favourites || []).find(doc => doc.id.toString() === adId)) {
        return this.save();
    }

    this.favourites = [...(this.favourites || []), { id: adId, addedAt: new Date() }];

    return this.save();
};

jobSeekerSchema.methods.removeFromFavourites = function (adId: string) {
    this.favourites = this.favourites.filter(favourite => favourite.id !== adId);

    return this.save();
};

jobSeekerSchema.methods.getFavourites = async function (pagination: any, filters?: {}, sort?: {}): Promise<PaginationInterface<AdDocument>> {
    this.favourites = this.favourites;
    const limit = pagination?.limit || 5;
    const page = pagination?.page || 0;

    const items = await Ad.find({
        ...filters,
        $in: this.favourites.map(favourite => favourite.id)
    })
        .limit(limit)
        .skip(page * limit)
        .sort(sort);

    const all = await Ad.find({
        ...filters,
        $in: this.favourites.map(favourite => favourite.id)
    }).count();

    return {
        items,
        limit: limit,
        total: Math.ceil(all / limit),
        totalItems: all,
        page: page
    };
};

jobSeekerSchema.methods.getPublicData = function () {
    return {
        id: this._id,
        role: 'job-seeker',
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        description: this?.description || '',
        meta: this?.meta || '',
        cv: this.cv || '',
        favourites: this?.favourites || [''],
    };
};

jobSeekerSchema.methods.removeAppliedJob = function (job: string) {
    this.appliedForJobs = (this.appliedForJobs || []).filter((appliedJob: any) => appliedJob.id.toString() !== job);

    return this.save();
};

jobSeekerSchema.methods.getAppliedJobs = async function (): Promise<AdDocument[]> {
    return Ad.find({ $in: this.appliedForJobs });
};

jobSeekerSchema.methods.loginAttempts = async function (loginAttempts: number): Promise<JobSeekerDocument> {
    this.status.loginAttempts = loginAttempts;

    return this.save();
};

jobSeekerSchema.methods.getUserSecurityQuestion = async function (): Promise<string> {
    return this.securityQuestion;
};

jobSeekerSchema.methods.addView = async function (adId: string): Promise<JobSeekerDocument> {
    if (!this.viewedAd) {
        this.viewedAd = [{ id: adId, viewedAt: new Date() }];
    }

    this.viewedAd.push({ id: adId, viewedAt: new Date() });

    return this.save();
};

export interface JobSeekerModel extends mongoose.Model<any> {
    getUsers(this: mongoose.Model<any>): Promise<JobSeekerDocument[]>;

    deleteUser(this: mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: mongoose.Model<any>, userData: JobSeekerDocument, userId: string): Promise<any>;

    getUser(this: mongoose.Model<any>, userId: string): Promise<JobSeekerDocument>;
}

jobSeekerSchema.static('getUsers', async function (this: mongoose.Model<any>): Promise<JobSeekerDocument[]> {
    return this.find({ isRecruiter: false });
});

jobSeekerSchema.static('deleteUser', async function (this: mongoose.Model<any>, userId: string): Promise<boolean> {
    const response = await this.deleteOne({ _id: userId });

    return !!response?.acknowledged;
});

jobSeekerSchema.static('updateUser', async function (this: mongoose.Model<any>, userData: JobSeekerDocument, userId: string): Promise<any> {
    return this.updateOne({ _id: userId }, { ...userData });
});

jobSeekerSchema.static('getUser', async function (this: mongoose.Model<any>, userId: string): Promise<JobSeekerDocument> {
    return this.findOne({ _id: userId });
});

export default mongoose.model<JobSeekerDocument, JobSeekerModel>('JobSeeker', jobSeekerSchema);
