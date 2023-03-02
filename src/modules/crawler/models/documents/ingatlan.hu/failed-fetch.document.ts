import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import { CrawlerConfigInterface } from '../../../services/interfaces/crawler-config.interface';
import { CrawlerTypes } from '../../../tasks/task-manager';

const Schema = mongoose.Schema;

export interface FailedFetchDocument extends Document, CrawlerConfigInterface {
    crawlerName: CrawlerTypes;
}

export interface FailedFetchModel extends Mongoose.Model<FailedFetchDocument> {

}

const FailedFetch = new Schema<FailedFetchDocument>({
    location: { type: String },
    baseUrl: { type: String },
    url: { type: String },
    targetPoints: [{ type: String }],
    crawlerName: { type: String },
});

FailedFetch.set('timestamps', true);

export default mongoose.model<FailedFetchDocument, FailedFetchModel>('FailedFetch', FailedFetch);
