import Ad, { AdDocument } from '@models/ad';
import { BaseUserDocument } from '@models/user';
import Mongoose from 'mongoose';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface JobSeekerDocument extends BaseUserDocument {
    first_name: string;
    last_name: string;
    images?: string[];
    resume?: string;
    other_uploads?: string[];
    addAppliedJobs: (job: string) => Promise<JobSeekerDocument>;
    removeAppliedJob: (job: string) => Promise<JobSeekerDocument>;
    getAppliedJobs: () => Promise<AdDocument[]>;
}

const userSchema = new Schema<JobSeekerDocument>({
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
    appliedForJobs: { type: [mongoose.Types.ObjectId], ref: 'Ad' },
    description: { type: String },
    logo: { type: String },
    meta: { type: String },
    images: [{ type: String }],
    resume: { type: String },
    other_uploads: { type: [String] },
});

userSchema.set('timestamps', true);

userSchema.plugin(uniqueValidator);

userSchema.methods.addAppliedJobs = function (job: string) {
    this.appliedForJobs = [...(this.appliedForJobs || []), job];

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.removeAppliedJob = function (job: string) {
    this.appliedForJobs = (this.appliedForJobs || []).filter((appliedJob: any) => appliedJob.toString() !== job);

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.getAppliedJobs = async function (): Promise<AdDocument[]> {
    return Ad.find({ $in: this.appliedForJobs });
};

userSchema.methods.loginAttempts = async function (loginAttempts: number): Promise<JobSeekerDocument> {
    this.status.loginAttempts = loginAttempts;

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.getUserSecurityQuestion = async function (): Promise<string> {
    return this.securityQuestion;
};

export interface JobSeekerModel extends Mongoose.Model<any> {
    getUsers(this: Mongoose.Model<any>): Promise<JobSeekerDocument[]>;

    deleteUser(this: Mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: Mongoose.Model<any>, userData: JobSeekerDocument, userId: string): Promise<any>;

    getUser(this: Mongoose.Model<any>, userId: string): Promise<JobSeekerDocument>;
}

userSchema.static('getUsers', async function (this: Mongoose.Model<any>): Promise<JobSeekerDocument[]> {
    return this.find({ isRecruiter: false });
});

userSchema.static('deleteUser', async function (this: Mongoose.Model<any>, userId: string): Promise<boolean> {
    const response = await this.deleteOne({ _id: userId });

    return !!response?.acknowledged;
});

userSchema.static('updateUser', async function (this: Mongoose.Model<any>, userData: JobSeekerDocument, userId: string): Promise<any> {
    return this.updateOne({ _id: userId }, { ...userData });
});

userSchema.static('getUser', async function (this: Mongoose.Model<any>, userId: string): Promise<JobSeekerDocument> {
    return this.findOne({ _id: userId });
});

export default mongoose.model<JobSeekerDocument, JobSeekerModel>('JobSeeker', userSchema);
