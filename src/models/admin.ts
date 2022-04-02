import mongoose, { Model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface AdminModel {
    name: string;
    email: string;
    password: string;
    hint: string;
    answer: string;
    status: {
        loginAttempts: number;
        isBlocked: boolean;
    };
}

export interface AdminDocument extends AdminModel, Document {
    loginAttempts: (id: string, num: number) => Document;
}

const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    hint: { type: String, required: true },
    answer: { type: String, required: true },
    status: {
        loginAttempts: { type: Number, required: false, default: 0 },
        isBlocked: { type: Boolean, required: false, default: false }
    }
});

adminSchema.methods.loginAttempts = function (id: string, num: number) {
    return this.updateOne({ _id: id }, { status: { loginAttempts: num } });
};

adminSchema.plugin(uniqueValidator);

export default mongoose.model<AdminDocument>('Admin', adminSchema);
