import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface FilterItem {
    value: string;
    title: string;
    items: number;
}

export interface FilterDocument extends Document {
    location: string[];
    industryType: string[];
    companyType: string[];
    postedAt: string[];
    relatedRoles: string[];
    jobType: string[];
    updateFilter?: (data: FilterDocument) => Promise<FilterDocument>;
}

const filterSchema = new Schema<FilterDocument>({
    location: { type: [String] },
    industryType: { type: [String] },
    companyType: { type: [String] },
    postedAt: { type: [String] },
    relatedRoles: { type: [String] },
    jobType: { type: [String] }
});

filterSchema.set('timestamps', true);

filterSchema.plugin(uniqueValidator);

interface FilterModel extends Mongoose.Model<any> {
    getFilterById(this: Mongoose.Model<any>, employerId: string | number): Promise<FilterDocument>;
}

filterSchema.methods.updateFilter = function (data: FilterDocument): Promise<FilterDocument> {
    this.location = data?.location ?? this.location;
    this.industryType = data?.industryType ?? this.industryType;
    this.postedAt = data?.postedAt ?? this.postedAt;
    this.relatedRoles = data?.relatedRoles ?? this.relatedRoles;
    this.jobType = data?.jobType ?? this.jobType;

    return this.save({ validateModifiedOnly: true });
};

filterSchema.static('getFilterById', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<FilterDocument> {
    return this.findById(employerId);
});

export default mongoose.model<FilterDocument, FilterModel>('Filter', filterSchema);
