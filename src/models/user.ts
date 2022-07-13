import Ad, { AdDocument } from '@models/ad';
import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface UserDocument extends Document {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
    isRecruiter: boolean;
    postedJobs?: string[];
    appliedForJobs?: string[];
    status: {
        loginAttempts: number;
        isBlocked: boolean;
    };
    description?: string,
    // TODO -> we will need an attachment service for this. CDN setup
    logo?: string,
    meta?: string,
    images?: string[];
    resume?: string;
    addPostedJobs: (job: string) => Promise<void>;
    removePostedJob: (job: string) => Promise<void>;
    getPostedJobs: () => Promise<AdDocument[]>;
    addAppliedJobs: (job: string) => Promise<void>;
    removeAppliedJob: (job: string) => Promise<void>;
    getAppliedJobs: () => Promise<AdDocument[]>;
    loginAttempts: () => Promise<void>;
    getUserSecurityQuestion: () => Promise<string>;
}

const userSchema = new Schema({
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
    isRecruiter: { type: Boolean, required: true },
    postedJobs: { type: [mongoose.Types.ObjectId], ref: 'Ad' },
    appliedForJobs: { type: [mongoose.Types.ObjectId], ref: 'Ad' },
    description: { type: String },
    logo: { type: String },
    meta: { type: String },
    images: [{ type: String }],
    resume: { type: String },
});

userSchema.set('timestamps', true);

userSchema.plugin(uniqueValidator);

userSchema.methods.addPostedJobs = function (job: string) {
    this.postedJobs = [...this.postedJobs, job];

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.removePostedJob = function (job: string) {
    this.postedJobs = this.postedJobs.filter((postedJob: any) => postedJob.toString() !== job);

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.getPostedJobs = async function (): Promise<AdDocument[]> {
    return Ad.find({ $in: this.postedJobs });
};

userSchema.methods.addAppliedJobs = function (job: string) {
    this.appliedForJobs = [...this.appliedForJobs, job];

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.removeAppliedJob = function (job: string) {
    this.appliedForJobs = this.appliedForJobs.filter((appliedJob: any) => appliedJob.toString() !== job);

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.getAppliedJobs = async function (): Promise<AdDocument[]> {
    return Ad.find({ $in: this.appliedForJobs });
};

userSchema.methods.loginAttempts = async function (loginAttempts: number): Promise<void> {
    this.status.loginAttempts = loginAttempts;

    return this.save({ validateModifiedOnly: true });
};

userSchema.methods.getUserSecurityQuestion = async function (): Promise<string> {
    return this.securityQuestion;
};

interface UserModel extends Mongoose.Model<any> {
    getRecruiters(this: Mongoose.Model<any>): Promise<UserDocument[]>;

    getJobSeekers(this: Mongoose.Model<any>): Promise<UserDocument[]>;

    deleteUser(this: Mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: Mongoose.Model<any>, userData: UserDocument, userId: string): Promise<any>;

    getUser(this: Mongoose.Model<any>, userId: string): Promise<UserDocument>;
}

userSchema.static('getRecruiters', async function (this: Mongoose.Model<any>): Promise<UserDocument[]> {
    return this.find({ isRecruiter: true });
});

userSchema.static('getJobSeekers', async function (this: Mongoose.Model<any>): Promise<UserDocument[]> {
    return this.find({ isRecruiter: false });
});

userSchema.static('deleteUser', async function (this: Mongoose.Model<any>, userId: string): Promise<boolean> {
    const response = await this.deleteOne({ _id: userId });

    return !!response?.acknowledged;
});

userSchema.static('updateUser', async function (this: Mongoose.Model<any>, userData: UserDocument, userId: string): Promise<any> {
    return this.updateOne({ _id: userId }, { ...userData });
});

userSchema.static('getUser', async function (this: Mongoose.Model<any>, userId: string): Promise<UserDocument> {
    return this.findOne({ _id: userId });
});

export default mongoose.model<UserDocument, UserModel>('User', userSchema);
