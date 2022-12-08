import * as Mongoose from 'mongoose';
export declare const loginAttempts: (Model: Mongoose.Model<any, {}, {}, {}, any>, id: string, num: number) => Promise<import("mongodb").UpdateResult>;
export declare const getArrayFromObject: <T>(object: any) => T[];
