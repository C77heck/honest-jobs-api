import Ad, { AdDocument } from '@models/ad';
import { BaseUserDocument } from '@models/user';
import Mongoose from 'mongoose';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface RecruiterDocument extends BaseUserDocument {
    company_name: string;
    address: string;
    postedJobs?: string[];
    logo?: string,
    addPostedJobs: (job: string) => Promise<RecruiterDocument>;
    removePostedJob: (job: string) => Promise<RecruiterDocument>;
    getPostedJobs: () => Promise<AdDocument[]>;
}

const recruiterSchema = new Schema<RecruiterDocument>({
    company_name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    status: {
        loginAttempts: { type: Number, required: false, default: 0 },
        isBlocked: { type: Boolean, required: false, default: false }
    },
    isRecruiter: { type: Boolean, required: true, default: false },
    postedJobs: { type: [mongoose.Types.ObjectId], ref: 'Ad' },
    description: { type: String },
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

recruiterSchema.methods.getPostedJobs = async function (): Promise<AdDocument[]> {
    console.log({ postedJobs: this.postedJobs });
    // TODO -> this does not work at all.
    return Ad.find({ _id: { $in: this.postedJobs } });
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
