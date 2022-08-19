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
    location: FilterItem[];
    companyType: FilterItem[];
    postedAt: FilterItem[];
    relatedRoles: FilterItem[];
    updateFilter?: (data: FilterDocument) => Promise<FilterDocument>;
}

const filterDataSchema = new Schema({
    value: String,
    title: String,
    items: Number
});

const filterSchema = new Schema({
    location: { type: [filterDataSchema] },
    companyType: { type: [filterDataSchema] },
    postedAt: { type: [filterDataSchema] },
    relatedRoles: { type: [filterDataSchema] }
});

filterSchema.set('timestamps', true);

filterSchema.plugin(uniqueValidator);

interface FilterModel extends Mongoose.Model<any> {
    getFilterById(this: Mongoose.Model<any>, employerId: string | number): Promise<FilterDocument>;
}

filterSchema.methods.updateFilter = function (data: FilterDocument): Promise<FilterDocument> {
    this.location = data?.location ?? this.location;
    this.companyType = data?.companyType ?? this.companyType;
    this.postedAt = data?.postedAt ?? this.postedAt;
    this.relatedRoles = data?.relatedRoles ?? this.relatedRoles;

    return this.save({ validateModifiedOnly: true });
};

filterSchema.static('getFilterById', async function (this: Mongoose.Model<any>, employerId: string | number): Promise<FilterDocument> {
    return this.findById(employerId);
});

export default mongoose.model<FilterDocument, FilterModel>('Filter', filterSchema);
