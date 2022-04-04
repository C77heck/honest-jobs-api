import { UserDocument } from '@models/user';
import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// TODO -> We will need filters settable  for the employer to find suitable employees.
export interface EmployerDocument extends Document {
    name: string;
    description: string;
    location: string;
}

const employerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
});

employerSchema.set('timestamps', true);

employerSchema.plugin(uniqueValidator);

interface EmployerModel extends Mongoose.Model<any> {
    getEmployer(this: Mongoose.Model<any>, employerId: string): Promise<EmployerDocument>;

    updateData(this: Mongoose.Model<any>, employerData: EmployerDocument, employerId: string): Promise<EmployerDocument>;
}

employerSchema.static('getEmployer', async function (this: Mongoose.Model<any>, employerId: string): Promise<EmployerDocument> {
    return await this.findOne({ _id: employerId });
});

employerSchema.static('updateData', async function (this: Mongoose.Model<any>, employerData: EmployerDocument, employerId: string): Promise<EmployerDocument> {
    return await this.updateOne({ _id: employerId }, { ...employerData });
});

export default mongoose.model<EmployerDocument, EmployerModel>('Employer', employerSchema);
