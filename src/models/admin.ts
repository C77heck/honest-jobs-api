import mongoose, { Model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface AdminModel extends Document {
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

const adminSchema = new Schema({
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

adminSchema.plugin(uniqueValidator);

export default mongoose.model<AdminModel>('Admin', adminSchema);
