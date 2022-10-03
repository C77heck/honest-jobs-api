import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

export interface ReviewDocument extends Mongoose.Document {
    title: string;
    description: string;
    salary: string;
    location: string;
    roleHeld: string;
    suggestions?: string;
    rating: number;
    pros: string[];
    cons: string[];
    startDate: Date;
    finishDate: Date;
    isCurrentEmployer: boolean;
    employerId: Mongoose.Types.ObjectId;
}

const reviewSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    currency: { type: String, required: true },
    location: { type: String, required: true },
    roleHeld: { type: String, required: true },
    rating: { type: Number, required: true },
    suggestions: { type: String },
    pros: [{ type: String, required: true }],
    cons: [{ type: String, required: true }],
    startDate: { type: Date, required: true },
    finishDate: { type: Date },
    isCurrentEmployer: { type: Boolean, required: true },
    employerId: { type: Mongoose.Types.ObjectId, required: true, ref: 'User' },
});

reviewSchema.set('timestamps', true);

interface ReviewModel extends Mongoose.Model<any> {
    getReviewsForEmployer(this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument[]>;

    updateReview(this: Mongoose.Model<any>, employerId: string | number, reviewData: ReviewDocument): Promise<ReviewDocument>;

    deleteReview(this: Mongoose.Model<any>, employerId: string | number): Promise<any>;

    getReviewById(this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument>;
}

reviewSchema.static('getReviewsForEmployer', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument[]> {
    return this.find({ _id: employerId });
});

reviewSchema.static('updateAd', async function (this: Mongoose.Model<any>, employerId: string | number, adData: ReviewDocument): Promise<ReviewDocument> {
    return this.updateOne({ _id: employerId }, adData);
});

reviewSchema.static('deleteAd', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument> {
    return this.deleteOne({ _id: employerId });
});

reviewSchema.static('getReviewById', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument> {
    return this.findById(employerId);
});

export default Mongoose.model<ReviewDocument, ReviewModel>('Review', reviewSchema);
