import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface ReviewDocument extends Document {
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
    employerId: mongoose.Types.ObjectId;
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
    employerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

reviewSchema.set('timestamps', true);

reviewSchema.plugin(uniqueValidator);

interface ReviewModel extends Mongoose.Model<any> {
    getReviewsForEmployer(this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument[]>;

    updateReview(this: Mongoose.Model<any>, employerId: string | number, reviewData: ReviewDocument): Promise<ReviewDocument>;

    deleteReview(this: Mongoose.Model<any>, employerId: string | number): Promise<any>;

    getReviewById(this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument>;
}

reviewSchema.static('updateAd', async function (this: Mongoose.Model<any>, employerId: string | number, adData: ReviewDocument): Promise<ReviewDocument> {
    return await this.updateOne({ _id: employerId }, adData);
});

reviewSchema.static('deleteAd', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument> {
    return await this.deleteOne({ _id: employerId });
});

reviewSchema.static('getReviewById', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<ReviewDocument> {
    return await this.findOne({ _id: employerId });
});

export default mongoose.model<ReviewDocument, ReviewModel>('Review', reviewSchema);
