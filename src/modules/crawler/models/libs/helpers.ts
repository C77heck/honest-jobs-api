import * as Mongoose from 'mongoose';

export const loginAttempts = async (Model: Mongoose.Model<any>, id: string, num: number) => {
    return await Model.updateOne({ _id: id }, { status: { loginAttempts: num } });
};

export const getArrayFromObject = <T>(object: any): T[] => {
    let result: any[] = [];
    for (const prop in object) {
        result = [...result, { ...object[prop], id: prop }];
    }

    return result;
};
