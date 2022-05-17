import { loginAttempts } from '@models/libs/helpers';
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
    status: {
        loginAttempts: number;
        isBlocked: boolean;
    };
    description?: string,
    // TODO -> we will need an attachment service for this. CDN setup
    logo?: string,
    meta?: string,
    images?: string[];
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
    description: { type: String },
    logo: { type: String },
    meta: { type: String },
    images: [{ type: String }],
});

userSchema.set('timestamps', true);

userSchema.plugin(uniqueValidator);

interface UserModel extends Mongoose.Model<any> {
    getRecruiters(this: Mongoose.Model<any>): Promise<UserDocument[]>;

    getJobSeekers(this: Mongoose.Model<any>): Promise<UserDocument[]>;

    loginAttempts(this: Mongoose.Model<any>, id: string, num: number): Promise<number>;

    getUserSecurityQuestion(this: Mongoose.Model<any>, userId: string): Promise<string>;

    deleteUser(this: Mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: Mongoose.Model<any>, userData: UserDocument, userId: string): Promise<any>;

    getUser(this: Mongoose.Model<any>, userId: string): Promise<UserDocument>;
}

userSchema.static('getRecruiters', async function (this: Mongoose.Model<any>): Promise<UserDocument[]> {
    return await this.find({ isRecruiter: true });
});

userSchema.static('getJobSeekers', async function (this: Mongoose.Model<any>): Promise<UserDocument[]> {
    return await this.find({ isRecruiter: false });
});

userSchema.static('loginAttempts', async function (this: Mongoose.Model<any>, id: string, num: number): Promise<number> {
    return await this.updateOne({ _id: id }, { status: { loginAttempts: num } });
});

userSchema.static('getUserSecurityQuestion', async function (this: Mongoose.Model<any>, userId: string): Promise<string> {
    return (await this.findOne({ _id: userId }))?.securityQuestion;
});

userSchema.static('deleteUser', async function (this: Mongoose.Model<any>, userId: string): Promise<boolean> {
    const response = await this.deleteOne({ _id: userId });

    return !!response?.acknowledged;
});

userSchema.static('updateUser', async function (this: Mongoose.Model<any>, userData: UserDocument, userId: string): Promise<any> {
    return await this.updateOne({ _id: userId }, { ...userData });
});

userSchema.static('getUser', async function (this: Mongoose.Model<any>, userId: string): Promise<UserDocument> {
    return await this.findOne({ _id: userId });
});

export default mongoose.model<UserDocument, UserModel>('User', userSchema);
