import Ad, { AdDocument } from '@models/ad';
import { BaseUserDocument } from '@models/user';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface JobSeekerDocument extends BaseUserDocument {
    first_name: string;
    last_name: string;
    images?: string[];
    resume?: string;
    other_uploads?: string[];
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
    images: [{ type: String }],
    resume: { type: String },
    other_uploads: { type: [String] },
});

jobSeekerSchema.set('timestamps', true);

jobSeekerSchema.plugin(uniqueValidator);

jobSeekerSchema.methods.addAppliedJobs = function (job: string) {
    this.appliedForJobs = [...(this.appliedForJobs || []), { id: job, appliedAt: new Date() }];

    return this.save({ validateModifiedOnly: true });
};

jobSeekerSchema.methods.addToFavourites = function (adId: string) {
    if ((this.favourites || []).find(doc => doc.id.toString() === adId)) {
        return this.save({ validateModifiedOnly: true });
    }

    this.favourites = [...(this.favourites || []), { id: adId, addedAt: new Date() }];

    return this.save({ validateModifiedOnly: true });
};

jobSeekerSchema.methods.removeFromFavourites = function (adId: string) {
    this.favourites = this.favourites.filter(favourite => favourite.id !== adId);

    return this.save({ validateModifiedOnly: true });
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
        images: this?.images || [''],
        resume: this?.resume || '',
        other_uploads: this?.other_uploads || [''],
        favourites: this?.favourites || [''],
    };
};

jobSeekerSchema.methods.removeAppliedJob = function (job: string) {
    this.appliedForJobs = (this.appliedForJobs || []).filter((appliedJob: any) => appliedJob.id.toString() !== job);

    return this.save({ validateModifiedOnly: true });
};

jobSeekerSchema.methods.getAppliedJobs = async function (): Promise<AdDocument[]> {
    return Ad.find({ $in: this.appliedForJobs });
};

jobSeekerSchema.methods.loginAttempts = async function (loginAttempts: number): Promise<JobSeekerDocument> {
    this.status.loginAttempts = loginAttempts;

    return this.save({ validateModifiedOnly: true });
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
