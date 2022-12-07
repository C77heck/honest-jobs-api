import Mongoose from 'Mongoose';

const Schema = Mongoose.Schema;

// todo -> need to figure a meta data connection thingy
export interface RoleDocument extends Mongoose.Document {
    name: string;
    updateRole: (data: RoleDocument) => Promise<RoleDocument>;
}

const roleSchema = new Schema<RoleDocument>({
    name: { type: String, required: true },
});

roleSchema.set('timestamps', true);

roleSchema.methods.updateRole = function (data: RoleDocument) {
    this.name = data?.name ?? this.name;

    return this.save();
};

export interface RoleModel extends Mongoose.Model<any> {
    getRoles(this: Mongoose.Model<any>): Promise<RoleDocument[]>;

    getRole(this: Mongoose.Model<any>, userId: string): Promise<RoleDocument>;

}

roleSchema.static('getRoles', async function (this: Mongoose.Model<any>): Promise<RoleDocument[]> {
    return this.find({});
});
roleSchema.static('getRole', async function (this: Mongoose.Model<any>, roleId: string): Promise<RoleDocument> {
    return this.findOne({ _id: roleId });
});

export default Mongoose.model<RoleDocument, RoleModel>('Role', roleSchema);
