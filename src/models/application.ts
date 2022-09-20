import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface ApplicationDocument extends Document {
    ad: { type: Mongoose.Types.ObjectId, ref: 'Ad' };
    applicant: { type: Mongoose.Types.ObjectId, ref: 'job-seeker' };
}

const applicationSchema = new Schema<ApplicationDocument>({
    ad: { type: Mongoose.Types.ObjectId, ref: 'Ad' },
    applicant: { type: Mongoose.Types.ObjectId, ref: 'job-seeker' },
});

applicationSchema.set('timestamps', true);

interface ApplicationModel extends Mongoose.Model<any> {
    getBy(this: Mongoose.Model<any>, jobSeekerId: string, adId: string): Promise<ApplicationDocument>;
}

applicationSchema.static('getBy', async function (this: Mongoose.Model<any>, jobSeekerId: string, adId: string): Promise<ApplicationDocument> {
    return this.findOne({ ad: adId, applicant: jobSeekerId });
});

export default mongoose.model<ApplicationDocument, ApplicationModel>('Application', applicationSchema);
