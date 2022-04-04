// We get around the static methods declaration inside the model as typescript
// seem to make it too difficult.

export const loginAttempts = (Model: any, id: string, num: number) => {
    return Model.updateOne({ _id: id }, { status: { loginAttempts: num } });
};

