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
    timestamps: { type: Boolean, default: true },
    isEmployer: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);

// TODO -> Notice that in order to touch static and query helper functions we need to extend the model like so. not the document.
// notice the return statement on the promise in the argument part is what the actual data we return will be.
interface UserModel extends Mongoose.Model<any> {
    loginAttempts(this: Mongoose.Model<any>, id: string, num: number): Promise<number>;

    getUserSecurityQuestion(this: Mongoose.Model<any>, userId: string): Promise<string>;
}

userSchema.static('loginAttempts', async function (this: Mongoose.Model<any>, id: string, num: number): Promise<number> {
    return this.updateOne({ _id: id }, { status: { loginAttempts: num } });
});

userSchema.static('getUserSecurityQuestion', async function (this: Mongoose.Model<any>, userId: string): Promise<string> {
    return (await this.findOne({ _id: userId }))?.securityQuestion;
});

export default mongoose.model<UserDocument, UserModel>('User', userSchema);
