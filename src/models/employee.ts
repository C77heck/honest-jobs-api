import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

// TODO -> We will need filters settable  for the employee to find suitable employers.
export interface EmployeeModel extends Document {
    name: string;
    description: string;
    location: string;
}

const employeeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
});

employeeSchema.set('timestamps', true);

employeeSchema.plugin(uniqueValidator);

export default mongoose.model<EmployeeModel>('Employee', employeeSchema);
