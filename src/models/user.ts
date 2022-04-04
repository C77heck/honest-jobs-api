import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface UserModel extends Document {
    name: string;
    email: string;
    password: string;
    hint: string;
    answer: string;
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
    hint: { type: String, required: true },
    answer: { type: String, required: true },
    status: {
        loginAttempts: { type: Number, required: false, default: 0 },
        isBlocked: { type: Boolean, required: false, default: false }
    },
    timestamps: { type: Boolean, default: true },
    isEmployer: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<UserModel>('User', userSchema);
