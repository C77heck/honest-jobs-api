import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface WatchDocument extends Document {
    href: string;
}

export interface WatchModel extends Mongoose.Model<WatchDocument> {

}

const Watch = new Schema<WatchDocument>({
    href: { type: String }
});

Watch.index({ href: 'text' });

Watch.set('timestamps', true);

export default mongoose.model<WatchDocument, WatchModel>('Watch', Watch);
