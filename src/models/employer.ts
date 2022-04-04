import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// TODO -> We will need filters settable  for the employer to find suitable employees.
export interface EmployerModel extends Document {
    name: string;
    description: string;
    location: string;
}

const employerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
});

employerSchema.plugin(uniqueValidator);

export default mongoose.model<EmployerModel>('Employer', employerSchema);
