// We get around the static methods declaration inside the model as typescript
// seem to make it too difficult.

import * as Mongoose from 'mongoose';

export const loginAttempts = async (Model: Mongoose.Model<any>, id: string, num: number) => {
    return await Model.updateOne({ _id: id }, { status: { loginAttempts: num } });
};

export const getUserSecurityQuestion = async (Model: Mongoose.Model<any>, userId: string) => {
    const user = await Model.findOne({ _id: userId });
    console.log(user);
    return null;
};
