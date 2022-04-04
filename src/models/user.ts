import { loginAttempts } from '@models/libs/helpers';
import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
    isEmployer: boolean;
    status: {
        loginAttempts: number;
        isBlocked: boolean;
    };
}

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    status: {
        loginAttempts: { type: Number, required: false, default: 0 },
        isBlocked: { type: Boolean, required: false, default: false }
    },
    isEmployer: { type: Boolean, required: true },
});

userSchema.set('timestamps', true);

userSchema.plugin(uniqueValidator);

interface UserModel extends Mongoose.Model<any> {
    loginAttempts(this: Mongoose.Model<any>, id: string, num: number): Promise<number>;

    getUserSecurityQuestion(this: Mongoose.Model<any>, userId: string): Promise<string>;

    delete(this: Mongoose.Model<any>, userId: string): Promise<boolean>;

    updateUser(this: Mongoose.Model<any>, userData: UserDocument, userId: string): Promise<any>;

    getUser(this: Mongoose.Model<any>, userId: string): Promise<UserDocument>;
}

userSchema.static('loginAttempts', async function (this: Mongoose.Model<any>, id: string, num: number): Promise<number> {
    return this.updateOne({ _id: id }, { status: { loginAttempts: num } });
});

userSchema.static('getUserSecurityQuestion', async function (this: Mongoose.Model<any>, userId: string): Promise<string> {
    return (await this.findOne({ _id: userId }))?.securityQuestion;
});

userSchema.static('delete', async function (this: Mongoose.Model<any>, userId: string): Promise<boolean> {
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
