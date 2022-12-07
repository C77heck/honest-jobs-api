import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface FilterItem {
    value: string;
    title: string;
    items: number;
}

export interface FilterDocument extends Document {
    location: FilterItem[];
    industryType: FilterItem[];
    companyType: FilterItem[];
    postedAt: FilterItem[];
    relatedRoles: FilterItem[];
    jobType: FilterItem[];
    salaries: FilterItem[];
    updateFilter?: (data: FilterDocument) => Promise<FilterDocument>;
}

const filterItemSchema = new Schema<FilterItem>({
    value: String,
    title: String,
    items: Number
});

const filterSchema = new Schema<FilterDocument>({
    location: { type: [filterItemSchema] },
    industryType: { type: [filterItemSchema] },
    companyType: { type: [filterItemSchema] },
    postedAt: { type: [filterItemSchema] },
    relatedRoles: { type: [filterItemSchema] },
    jobType: { type: [filterItemSchema] },
    salaries: { type: [filterItemSchema] }
});

filterSchema.set('timestamps', true);

interface FilterModel extends Mongoose.Model<any> {
    getFilterById(this: Mongoose.Model<any>, employerId: string | number): Promise<FilterDocument>;
}

filterSchema.methods.updateFilter = function (data: FilterDocument): Promise<FilterDocument> {
    this.location = data?.location ?? this.location;
    this.industryType = data?.industryType ?? this.industryType;
    this.postedAt = data?.postedAt ?? this.postedAt;
    this.relatedRoles = data?.relatedRoles ?? this.relatedRoles;
    this.jobType = data?.jobType ?? this.jobType;

    return this.save();
};

filterSchema.static('getFilterById', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<FilterDocument> {
    return this.findById(employerId);
});

export default mongoose.model<FilterDocument, FilterModel>('Filter', filterSchema);
