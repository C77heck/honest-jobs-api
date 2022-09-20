import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface ApplicationDocument extends Document {
    ad: { type: Mongoose.Types.ObjectId, ref: 'Ad' };
    applicant: { type: Mongoose.Types.ObjectId, ref: 'Job-seeker' };
    recruiter: { type: Mongoose.Types.ObjectId, ref: 'Recruiter' };
    status: {
        isRejected: boolean;
        isOfferMade: boolean;
        message: string;
    };
}

const applicationSchema = new Schema<ApplicationDocument>({
    ad: { type: Mongoose.Types.ObjectId, ref: 'Ad' },
    applicant: { type: Mongoose.Types.ObjectId, ref: 'Job-seeker' },
    recruiter: { type: Mongoose.Types.ObjectId, ref: 'Recruiter' },
    status: {
        isRejected: Boolean,
        isOfferMade: Boolean,
        message: String,
    },
});

applicationSchema.set('timestamps', true);

interface ApplicationModel extends Mongoose.Model<any> {
    getBy(this: Mongoose.Model<any>, jobSeekerId: string, adId: string): Promise<ApplicationDocument>;
}

applicationSchema.static('getBy', async function (this: Mongoose.Model<any>, jobSeekerId: string, adId: string): Promise<ApplicationDocument> {
    return this.findOne({ ad: adId, applicant: jobSeekerId });
});

export default mongoose.model<ApplicationDocument, ApplicationModel>('Application', applicationSchema);
